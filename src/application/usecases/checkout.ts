/* eslint-disable no-underscore-dangle */
import { CPF, PagamentoStatus, Status } from '../../domain/value-objects';
import type {
  IPagamentoGateway,
  IProdutoGateway,
  IUserGateway,
} from '../../interfaces/gateways';
import type { Produto } from '../../types';
import type { PedidoUseCase } from './pedido';

export class CheckoutUseCase {
  private _produtos: { produto: Produto; quantidade: number }[] = [];

  public constructor(
    private readonly pedidoUseCase: PedidoUseCase,
    private readonly pagamentoGateway: IPagamentoGateway,
    private readonly produtoGateway: IProdutoGateway,
    private readonly userGateway: IUserGateway
  ) {}

  public async checkout({
    produtos,
    cpf: rawCpf,
    email,
    name,
  }: {
    produtos: { id: string; quantidade: number }[];
    cpf: string;
    email?: string;
    name?: string;
  }): Promise<{ id: string; senha: string; qrCode: string }> {
    const cpf = rawCpf ? new CPF(String(rawCpf)).getValue() : null;
    if (cpf) {
      const user = await this.userGateway.getUser(cpf);
      if (!user) await this.userGateway.signUpUser({ cpf, email, name });
    }

    await this._adicionarProdutos(produtos);

    const pedidoCriado = await this.pedidoUseCase.criar({
      cliente: cpf,
      produtos: this._produtos,
      total: this._calcularTotalPedido(this._produtos),
      status: new Status('Recebido'),
      pagamentoStatus: new PagamentoStatus('Pendente'),
      senha: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
    });

    const { qrCode } = await this.pagamentoGateway.gerarPagamento(pedidoCriado);

    return { id: pedidoCriado.id, senha: pedidoCriado.senha, qrCode };
  }

  private async _adicionarProdutos(
    produtos: { id: string; quantidade: number }[]
  ): Promise<void> {
    if (!produtos?.length) throw new Error('Produtos não informados');
    const produtosPromises = produtos.map(async ({ id, quantidade }) => {
      const produto = await this.produtoGateway.buscarProdutoPorId(id);
      if (!produto) throw new Error('Produto não encontrado');
      return {
        produto: {
          nome: produto.nome,
          preco: produto.preco,
          descricao: produto.descricao,
        },
        quantidade,
      };
    });
    this._produtos = await Promise.all(produtosPromises);
  }

  private _calcularTotalPedido(
    produtosPedido: { produto: Produto; quantidade: number }[]
  ): number {
    return produtosPedido.reduce(
      (totalPedido, { produto, quantidade }) =>
        totalPedido + produto.preco * quantidade,
      0
    );
  }
}
