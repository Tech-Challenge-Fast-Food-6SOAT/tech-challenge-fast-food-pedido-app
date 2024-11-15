/* eslint-disable no-underscore-dangle */
import type {
  IPagamentoGateway,
  IProdutoGateway,
} from '../../interfaces/gateways';
import type { Produto } from '../../types';
import { CPF, PagamentoStatus, Status } from '../../value-objects';
import type { PedidoUseCase } from './pedido';

export class CheckoutUseCase {
  private _produtos: { produto: Produto; quantidade: number }[] = [];

  public constructor(
    private readonly pedidoUseCase: PedidoUseCase,
    private readonly pagamentoGateway: IPagamentoGateway,
    private readonly produtoGateway: IProdutoGateway
  ) {}

  public async checkout({
    produtos,
    cpf,
  }: {
    produtos: { id: string; quantidade: number }[];
    cpf: string;
  }): Promise<{ id: string; senha: string; qrCode: string }> {
    const cliente = cpf ? new CPF(String(cpf)).getValue() : null;
    await this._adicionarProdutos(produtos);

    const pedidoCriado = await this.pedidoUseCase.criar({
      cliente,
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
