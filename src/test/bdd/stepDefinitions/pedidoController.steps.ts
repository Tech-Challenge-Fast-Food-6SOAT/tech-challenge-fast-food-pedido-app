import { defineFeature, loadFeature } from 'jest-cucumber';

import { PedidoController } from '@/adapters/controllers';
import type { CheckoutUseCase, PedidoUseCase } from '@/application/usecases';
import type { HttpResponse } from '@/interfaces/http';

const feature = loadFeature('./src/test/bdd/features/pedidoController.feature');

defineFeature(feature, (test) => {
  const pedidoUseCase = {
    buscarPedidos: jest.fn(),
  } as unknown as PedidoUseCase;
  const checkoutUseCase = {
    checkout: jest.fn(),
  } as unknown as CheckoutUseCase;
  const pedidoController = new PedidoController(pedidoUseCase, checkoutUseCase);

  let response: HttpResponse = {} as HttpResponse;

  const pedidos = [
    {
      id: '123',
      status: 'Pronto',
      senha: '0001',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Get all pedidos', ({ given, when, then }) => {
    given('at least one pedido exists', () => {
      (pedidoUseCase.buscarPedidos as jest.Mock).mockResolvedValue(pedidos);
    });

    when('I call the buscarPedidos', async () => {
      response = await pedidoController.buscarPedidos();
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(response.statusCode).toEqual(Number(status));
    });

    then('I should receive a list of pedidos', () => {
      expect(response.data).toEqual(pedidos);
    });
  });

  test('There are no pedidos', ({ given, when, then }) => {
    given('no pedidos exist', () => {
      (pedidoUseCase.buscarPedidos as jest.Mock).mockResolvedValue([]);
    });

    when('I call the buscarPedidos', async () => {
      response = await pedidoController.buscarPedidos();
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(response.statusCode).toEqual(Number(status));
    });

    then('I should receive an empty list', () => {
      expect(response.data).toEqual([]);
    });
  });

  test('Receive an error', ({ given, when, then }) => {
    given('an error occurs when fetching pedidos', () => {
      (pedidoUseCase.buscarPedidos as jest.Mock).mockRejectedValue(
        new Error('Internal error')
      );
    });

    when('I call the buscarPedidos', async () => {
      response = await pedidoController.buscarPedidos();
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(response.statusCode).toEqual(Number(status));
    });

    then('I should receive an error message', () => {
      expect(response.data).toEqual({ err: 'Internal error' });
    });
  });
});
