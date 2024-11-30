import { defineFeature, loadFeature } from 'jest-cucumber';

import { PedidoGateway } from '@/adapters/gateways';
import type { DbConnection } from '@/interfaces/db/connection';
import type { PedidoProdutos } from '@/types';

const feature = loadFeature('./src/test/bdd/features/pedidoGateway.feature');

defineFeature(feature, (test) => {
  const dbConnection = { buscar: jest.fn() } as unknown as DbConnection;
  const pedidoGateway = new PedidoGateway(dbConnection);
  let result = [] as unknown as PedidoProdutos[];
  const pedidos = [
    {
      id: '123',
      cliente: '12345678910',
      status: 'Pronto',
      total: 10,
      pagamentoStatus: 'Aprovado',
      senha: '0001',
    },
  ] as unknown as PedidoProdutos;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Get all pedidos', ({ given, when, then }) => {
    given('at least one pedido exists', () => {
      (dbConnection.buscar as jest.Mock).mockResolvedValue(pedidos);
    });

    when('I call the buscarPedidos', async () => {
      result = await pedidoGateway.buscarPedidos();
    });

    then('I should receive a list of pedidos', () => {
      expect(result).toEqual(pedidos);
    });
  });

  test('There are no pedidos', ({ given, when, then }) => {
    given('no pedidos exist', () => {
      (dbConnection.buscar as jest.Mock).mockResolvedValue([]);
    });

    when('I call the buscarPedidos', async () => {
      result = await pedidoGateway.buscarPedidos();
    });

    then('I should receive an empty list of pedidos', () => {
      expect(result).toEqual([]);
    });
  });
});
