import { defineFeature, loadFeature } from 'jest-cucumber';

import type { PedidoGateway } from '@/adapters/gateways';
import { PedidoUseCase } from '@/application/usecases';
import type { PedidoProdutos } from '@/types';

const feature = loadFeature('./src/test/bdd/features/pedidoUseCase.feature');

defineFeature(feature, (test) => {
  const pedidoGateway = {
    buscarPedidos: jest.fn(),
  } as unknown as PedidoGateway;
  const pedidoUseCase = new PedidoUseCase(pedidoGateway);
  let result = [] as unknown as PedidoProdutos[];
  const pedidos = [
    {
      id: '123',
      status: 'Pronto',
      senha: '0001',
    },
  ] as unknown as PedidoProdutos;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Get all pedidos', ({ given, when, then }) => {
    given('at least one pedido exists', () => {
      (pedidoGateway.buscarPedidos as jest.Mock).mockResolvedValue(pedidos);
    });

    when('I call the buscarPedidos', async () => {
      result = await pedidoUseCase.buscarPedidos();
    });

    then('I should receive a list of pedidos', () => {
      expect(result).toEqual(pedidos);
    });
  });

  test('There are no pedidos', ({ given, when, then }) => {
    given('no pedidos exist', () => {
      (pedidoGateway.buscarPedidos as jest.Mock).mockResolvedValue([]);
    });

    when('I call the buscarPedidos', async () => {
      result = await pedidoUseCase.buscarPedidos();
    });

    then('I should receive an empty list of pedidos', () => {
      expect(result).toEqual([]);
    });
  });
});
