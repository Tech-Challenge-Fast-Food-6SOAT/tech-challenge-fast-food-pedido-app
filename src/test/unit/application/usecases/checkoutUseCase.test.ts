/* eslint-disable @typescript-eslint/unbound-method */
import type { PagamentoGateway, ProdutoGateway } from '@/adapters/gateways';
import type { PedidoUseCase } from '@/application/usecases';
import { CheckoutUseCase } from '@/application/usecases';
import type { Pedido } from '@/domain/entities';
import { PagamentoStatus, Status } from '@/domain/value-objects';
import type { IUserGateway } from '@/interfaces/gateways';

describe('CheckoutUseCase', () => {
  const pedidoUseCase = {
    criar: jest.fn(),
  } as unknown as PedidoUseCase;
  const pagamentoGateway = {
    gerarPagamento: jest.fn(),
  } as unknown as PagamentoGateway;
  const produtoGateway = {
    buscarProdutoPorId: jest.fn(),
  } as unknown as ProdutoGateway;
  const userGateway = {
    getUser: jest.fn(),
    signUpUser: jest.fn(),
  } as unknown as IUserGateway;
  const checkoutUseCase = new CheckoutUseCase(
    pedidoUseCase,
    pagamentoGateway,
    produtoGateway,
    userGateway
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkout', () => {
    it('should create a pedido and return it', async () => {
      const pedidoCriado = {
        id: '123',
        cliente: '12345678910',
        produtos: [
          {
            produto: {
              nome: 'NomeProduto',
              preco: 10,
              descricao: 'Descrição do Produto',
            },
            quantidade: 1,
          },
        ],
        total: 10,
        status: new Status('Recebido'),
        pagamentoStatus: new PagamentoStatus('Pendente'),
        senha: '0001',
      } as unknown as Pedido;

      const produtos = [{ id: '123', quantidade: 1 }];
      const cpf = '12345678910';
      (pedidoUseCase.criar as jest.Mock).mockResolvedValue(pedidoCriado);
      const qrCode = 'qrCode';
      (pagamentoGateway.gerarPagamento as jest.Mock).mockResolvedValue({
        qrCode,
      });
      (produtoGateway.buscarProdutoPorId as jest.Mock).mockResolvedValue({
        nome: 'NomeProduto',
        preco: 10,
        descricao: 'Descrição do Produto',
      });

      const result = await checkoutUseCase.checkout({ produtos, cpf });
      expect(result).toEqual({
        id: pedidoCriado.id,
        senha: pedidoCriado.senha,
        qrCode,
      });
      expect(pagamentoGateway.gerarPagamento).toHaveBeenCalledWith(
        pedidoCriado
      );
      expect(pagamentoGateway.gerarPagamento).toHaveBeenCalledTimes(1);
      expect(produtoGateway.buscarProdutoPorId).toHaveBeenCalledWith(
        produtos[0].id
      );
      expect(produtoGateway.buscarProdutoPorId).toHaveBeenCalledTimes(1);
      expect(pedidoUseCase.criar).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if no products are provided', async () => {
      const result = checkoutUseCase.checkout({
        produtos: [],
        cpf: '89101',
      });
      await expect(result).rejects.toThrow('Produtos não informados');
      expect(produtoGateway.buscarProdutoPorId).not.toHaveBeenCalled();
      expect(pagamentoGateway.gerarPagamento).not.toHaveBeenCalled();
      expect(pedidoUseCase.criar).not.toHaveBeenCalled();
    });

    it('should throw an error if product is not found', async () => {
      const produtos = [{ id: '123', quantidade: 1 }];
      const cpf = '12345678910';
      (produtoGateway.buscarProdutoPorId as jest.Mock).mockResolvedValue(null);

      const result = checkoutUseCase.checkout({ produtos, cpf });
      await expect(result).rejects.toThrow('Produto não encontrado');
      expect(produtoGateway.buscarProdutoPorId).toHaveBeenCalledTimes(1);
      expect(pagamentoGateway.gerarPagamento).not.toHaveBeenCalled();
      expect(pedidoUseCase.criar).not.toHaveBeenCalled();
    });
  });
});
