/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import { PedidoController } from '../adapters/controllers';
import {
  PagamentoGateway,
  PedidoGateway,
  ProdutoGateway,
  SecretsGateway,
} from '../adapters/gateways';
import { CheckoutUseCase, PedidoUseCase } from '../application/usecases';
import { PedidoDbConnection } from '../infra/database/mongodb/db-connections';
import {
  MicrosservicoPagamento,
  MicrosservicoProduto,
} from '../infra/microsservico';

const apiRoutes = async (app: FastifyInstance): Promise<void> => {
  const pedidoDbConnection = new PedidoDbConnection();
  const pedidoGateway = new PedidoGateway(pedidoDbConnection);
  const pedidoUseCase = new PedidoUseCase(pedidoGateway);
  const secretsGateway = new SecretsGateway();
  const microsservicoPagamentoGateway = new MicrosservicoPagamento(
    secretsGateway
  );
  const pagamentoGateway = new PagamentoGateway(microsservicoPagamentoGateway);
  const microsservicoProduto = new MicrosservicoProduto(secretsGateway);
  const produtoGateway = new ProdutoGateway(microsservicoProduto);
  const checkoutUseCase = new CheckoutUseCase(
    pedidoUseCase,
    pagamentoGateway,
    produtoGateway
  );
  const pedidoController = new PedidoController(pedidoUseCase, checkoutUseCase);

  app.get('/pedidos', async (request, reply) => {
    const response = await pedidoController.buscarPedidos(request);
    return reply.status(response.statusCode).send(response.data);
  });

  app.get('/pedidos/pedido/:id/status-pagamento', async (request, reply) => {
    const response = await pedidoController.statusPagamento(request);
    return reply.status(response.statusCode).send(response.data);
  });

  app.patch('/pedidos/pedido/:id/status-pagamento', async (request, reply) => {
    const response = await pedidoController.atualizarStatusPagamento(request);
    return reply.status(response.statusCode).send(response.data);
  });

  app.patch('/pedidos/pedido/:id/status', async (request, reply) => {
    const response = await pedidoController.atualizarStatusPedido(request);
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/pedidos/pedido/checkout', async (request, reply) => {
    const response = await pedidoController.checkout(request);
    return reply.status(response.statusCode).send(response.data);
  });
};

export default apiRoutes;
