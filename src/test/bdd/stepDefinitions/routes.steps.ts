/* eslint-disable @typescript-eslint/init-declarations */
import type { FastifyInstance } from 'fastify';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { PedidoController } from '@/adapters/controllers';
import apiRoutes from '@/api/routes';

import type { HttpRequest } from '../../../interfaces/http';

const feature = loadFeature('./src/test/bdd/features/routes.feature');

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

defineFeature(feature, (test) => {
  const fastifyInstance: jest.Mocked<FastifyInstance> = mockFastifyInstance();
  let mockRequest: HttpRequest;
  let mockReply: any;
  let mockResponse: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {} as HttpRequest;
    mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  });

  test('Get all pedidos', ({ given, when, then }) => {
    given('at least one pedido exists', () => {
      mockResponse = {
        statusCode: 200,
        data: [{ id: '123', status: 'Pronto' }],
      };
      (PedidoController.prototype.buscarPedidos as jest.Mock).mockResolvedValue(
        mockResponse
      );
    });

    when('I send a GET request to /pedidos', async () => {
      await apiRoutes(fastifyInstance);
      const routeHandler = fastifyInstance.get.mock.calls[0][1];
      await routeHandler(mockRequest, mockReply);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(mockReply.status).toHaveBeenCalledWith(Number(status));
    });

    then('the response should be a list of pedidos', () => {
      expect(mockReply.send).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  test('There are no pedidos', ({ given, when, then }) => {
    given('no pedidos exist', () => {
      mockResponse = { statusCode: 200, data: [] };
      (PedidoController.prototype.buscarPedidos as jest.Mock).mockResolvedValue(
        mockResponse
      );
    });

    when('I send a GET request to /pedidos', async () => {
      await apiRoutes(fastifyInstance);
      const routeHandler = fastifyInstance.get.mock.calls[0][1];
      await routeHandler(mockRequest, mockReply);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(mockReply.status).toHaveBeenCalledWith(Number(status));
    });

    then('the response should be an empty list', () => {
      expect(mockReply.send).toHaveBeenCalledWith(mockResponse.data);
    });
  });
});
