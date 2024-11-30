/* eslint-disable @typescript-eslint/unbound-method */
import type { PedidoGateway } from '@/adapters/gateways';
import { PedidoUseCase } from '@/application/usecases';
import { Pedido } from '@/domain/entities';
import { PagamentoStatus, Status } from '@/domain/value-objects';

describe('PedidoUseCase', () => {
  const pedidoGateway = {
    criar: jest.fn(),
    buscarPedido: jest.fn(),
    editar: jest.fn(),
  } as unknown as PedidoGateway;
  const pedidoUseCase = new PedidoUseCase(pedidoGateway);

  const pedido = {
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
  } as unknown as Omit<Pedido, 'id'>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('should create a pedido and return it', async () => {
      const pedidoGatewayOutput = new Pedido(
        '123',
        pedido.cliente,
        pedido.produtos,
        pedido.total,
        pedido.status,
        pedido.pagamentoStatus,
        pedido.senha
      );
      (pedidoGateway.criar as jest.Mock).mockResolvedValue(pedidoGatewayOutput);

      const result = await pedidoUseCase.criar(pedido);
      expect(result).toEqual(pedidoGatewayOutput);
      expect(pedidoGateway.criar).toHaveBeenCalledWith(pedido);
    });
  });

  describe('atualizarStatusPedido', () => {
    it('should update a pedido status and return it', async () => {
      const pedidoGatewayOutput = new Pedido(
        '123',
        pedido.cliente,
        pedido.produtos,
        pedido.total,
        new Status('Pronto'),
        pedido.pagamentoStatus,
        pedido.senha
      );
      (pedidoGateway.buscarPedido as jest.Mock).mockResolvedValue(
        pedidoGatewayOutput
      );
      (pedidoGateway.editar as jest.Mock).mockResolvedValue(
        pedidoGatewayOutput
      );

      const result = await pedidoUseCase.atualizarStatusPedido({
        id: '123',
        status: 'Pronto' as unknown as Status,
      });
      expect(result).toEqual(pedidoGatewayOutput);
      expect(pedidoGateway.buscarPedido).toHaveBeenCalledWith('123');
      expect(pedidoGateway.editar).toHaveBeenCalledWith({
        id: '123',
        value: { status: 'Pronto' },
      });
    });

    it('should throw an error if pedido is not found', async () => {
      (pedidoGateway.buscarPedido as jest.Mock).mockResolvedValue(null);
      const result = pedidoUseCase.atualizarStatusPedido({
        id: '123',
        status: 'Pronto' as unknown as Status,
      });
      await expect(result).rejects.toThrow('Pedido não encontrado');
    });
  });

  describe('statusPagamento', () => {
    it('should return the pedido payment status', async () => {
      const pagamentoStatus = 'Aprovado';
      (pedidoGateway.buscarPedido as jest.Mock).mockResolvedValue({
        pagamentoStatus,
      });

      const result = await pedidoUseCase.statusPagamento('123');
      expect(result).toEqual(pagamentoStatus);
      expect(pedidoGateway.buscarPedido).toHaveBeenCalledWith('123');
    });

    it('should throw an error if pedido is not found', async () => {
      (pedidoGateway.buscarPedido as jest.Mock).mockResolvedValue(null);
      const result = pedidoUseCase.statusPagamento('123');
      await expect(result).rejects.toThrow('Pedido não encontrado');
    });
  });

  describe('atualizarStatusPagamento', () => {
    it('should update a pedido payment status and return it', async () => {
      const pedidoGatewayOutput = new Pedido(
        '123',
        pedido.cliente,
        pedido.produtos,
        pedido.total,
        pedido.status,
        new PagamentoStatus('Aprovado'),
        pedido.senha
      );
      (pedidoGateway.buscarPedido as jest.Mock).mockResolvedValue(
        pedidoGatewayOutput
      );
      (pedidoGateway.editar as jest.Mock).mockResolvedValue(
        pedidoGatewayOutput
      );

      const result = await pedidoUseCase.atualizarStatusPagamento({
        id: '123',
        pagamentoStatus: 'Aprovado' as unknown as PagamentoStatus,
      });
      expect(result).toEqual(pedidoGatewayOutput);
      expect(pedidoGateway.buscarPedido).toHaveBeenCalledWith('123');
      expect(pedidoGateway.editar).toHaveBeenCalledWith({
        id: '123',
        value: { pagamentoStatus: 'Aprovado' },
      });
    });

    it('should throw an error if pedido is not found', async () => {
      (pedidoGateway.buscarPedido as jest.Mock).mockResolvedValue(null);
      const result = pedidoUseCase.atualizarStatusPagamento({
        id: '123',
        pagamentoStatus: 'Aprovado' as unknown as PagamentoStatus,
      });
      await expect(result).rejects.toThrow('Pedido não encontrado');
    });
  });
});
