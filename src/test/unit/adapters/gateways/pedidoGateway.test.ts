/* eslint-disable no-underscore-dangle */
import { PedidoGateway } from '@/adapters/gateways';
import { Pedido } from '@/domain/entities';
import { PagamentoStatus, Status } from '@/domain/value-objects';
import type { DbConnection } from '@/interfaces/db/connection';

describe('PedidoGateway', () => {
  const dbConnection = {
    buscar: jest.fn(),
    buscarUm: jest.fn(),
    criar: jest.fn(),
    editar: jest.fn(),
  } as unknown as DbConnection;
  const pedidoGateway = new PedidoGateway(dbConnection);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarPedido', () => {
    it('should return pedido document', async () => {
      const pedido = {
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
        status: 'Recebido',
        pagamentoStatus: 'Aprovado',
        senha: '0001',
      };
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(pedido);

      const result = await pedidoGateway.buscarPedido('123');

      expect(result).toEqual(pedido);
      expect(dbConnection.buscarUm).toHaveBeenCalledWith({ _id: '123' });
    });

    it('should return null if pedido is not found', async () => {
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(null);
      const result = await pedidoGateway.buscarPedido('123');
      expect(result).toBeNull();
      expect(dbConnection.buscarUm).toHaveBeenCalledWith({ _id: '123' });
    });
  });

  describe('criar', () => {
    it('should create a pedido', async () => {
      const pedido = {
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
      const pedidoCriado = { _id: '123', ...pedido };
      (dbConnection.criar as jest.Mock).mockResolvedValue(pedidoCriado);

      const result = await pedidoGateway.criar(pedido);

      expect(result).toEqual(
        new Pedido(
          pedidoCriado._id,
          pedido.cliente,
          pedido.produtos,
          pedido.total,
          pedido.status,
          pedido.pagamentoStatus,
          pedido.senha
        )
      );
      expect(dbConnection.criar).toHaveBeenCalledWith({
        ...pedido,
        status: pedido.status.status,
        pagamentoStatus: pedido.pagamentoStatus.status,
      });
    });
  });

  describe('editar', () => {
    it('should edit a product', async () => {
      const pedido = {
        id: '123',
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
        status: 'Recebido',
        pagamentoStatus: 'Aprovado',
        senha: '0001',
      } as unknown as Pedido;
      (dbConnection.editar as jest.Mock).mockResolvedValue(pedido);

      const params = { id: '123', value: { status: 'Pronto' } };
      const result = await pedidoGateway.editar(params);

      expect(result).toEqual(
        new Pedido(
          pedido.id,
          pedido.cliente,
          pedido.produtos,
          pedido.total,
          pedido.status,
          pedido.pagamentoStatus,
          pedido.senha
        )
      );
      expect(dbConnection.editar).toHaveBeenCalledWith(params);
    });

    it('should return null if pedido is not found', async () => {
      const params = { id: '123', value: { status: 'Pronto' } };
      (dbConnection.editar as jest.Mock).mockResolvedValue(null);
      const result = await pedidoGateway.editar(params);
      expect(result).toBeNull();
      expect(dbConnection.editar).toHaveBeenCalledWith(params);
    });
  });
});
