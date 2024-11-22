/* eslint-disable @typescript-eslint/unbound-method */
import type { FastifyInstance } from 'fastify/types/instance';

import { PedidoController } from '@/adapters/controllers';
import apiRoutes from '@/api/routes';

const mockFastifyInstance = (): jest.Mocked<FastifyInstance> => {
  const fastifyInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  } as unknown as jest.Mocked<FastifyInstance>;

  return fastifyInstance;
};

jest.mock('@/infra/database/mongodb', () => ({
  mongoConnection: {
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    }),
  },
}));
jest.mock('@/adapters/gateways/pedido');
jest.mock('@/application/usecases');
jest.mock('@/infra/database/mongodb/db-connections');
jest.mock('@/infra/database/mongodb');

jest
  .mock('@/adapters/controllers')
  .fn(jest.fn().mockResolvedValue({ statusCode: 200, data: [] }));
PedidoController.prototype.buscarPedidos = jest.fn();
PedidoController.prototype.atualizarStatusPedido = jest.fn();
PedidoController.prototype.statusPagamento = jest.fn();
PedidoController.prototype.atualizarStatusPagamento = jest.fn();
PedidoController.prototype.checkout = jest.fn();

describe('apiRoutes', () => {
  const fastifyInstance: jest.Mocked<FastifyInstance> = mockFastifyInstance();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register routes correctly', async () => {
    await apiRoutes(fastifyInstance);

    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/pedidos',
      expect.any(Function)
    );
    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/pedidos/pedido/:id/status-pagamento',
      expect.any(Function)
    );
    expect(fastifyInstance.patch).toHaveBeenCalledWith(
      '/pedidos/pedido/:id/status-pagamento',
      expect.any(Function)
    );
    expect(fastifyInstance.patch).toHaveBeenCalledWith(
      '/pedidos/pedido/:id/status',
      expect.any(Function)
    );
    expect(fastifyInstance.post).toHaveBeenCalledWith(
      '/pedidos/pedido/checkout',
      expect.any(Function)
    );
  });

  it('should call buscarProdutoPorCategoria on GET /pedidos', async () => {
    const mockRequest = null as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (PedidoController.prototype.buscarPedidos as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(PedidoController.prototype.buscarPedidos).toHaveBeenCalledWith();
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call statusPagamento on GET /pedidos/pedido/:id/status-pagamento', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (PedidoController.prototype.statusPagamento as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[1][1];
    await routeHandler(mockRequest, mockReply);

    expect(PedidoController.prototype.statusPagamento).toHaveBeenCalledWith(
      mockRequest
    );
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call atualizarStatusPagamento on PATCH /pedidos/pedido/:id/status-pagamento', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (
      PedidoController.prototype.atualizarStatusPagamento as jest.Mock
    ).mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.patch.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(
      PedidoController.prototype.atualizarStatusPagamento
    ).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call atualizarStatusPedido on PATCH /pedidos/pedido/:id/status', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (
      PedidoController.prototype.atualizarStatusPedido as jest.Mock
    ).mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.patch.mock.calls[1][1];
    await routeHandler(mockRequest, mockReply);

    expect(
      PedidoController.prototype.atualizarStatusPedido
    ).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call checkout on POST /pedidos/pedido/checkout', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (PedidoController.prototype.checkout as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.post.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(PedidoController.prototype.checkout).toHaveBeenCalledWith(
      mockRequest
    );
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });
});
