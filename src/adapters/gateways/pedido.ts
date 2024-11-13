/* eslint-disable no-underscore-dangle */
import { Pedido } from '../../domain/entities/pedido';
import type { DbConnection } from '../../interfaces/db/connection';
import type { IPedidoGateway } from '../../interfaces/gateways/pedido';
import type { PedidoProdutos } from '../../types/pedido-produtos';

export class PedidoGateway implements IPedidoGateway {
  public constructor(private readonly dbConnection: DbConnection) {}

  public async buscarPedidos(): Promise<PedidoProdutos[]> {
    const pedidos = await this.dbConnection.buscar<Pedido>({});

    return pedidos.map((pedido) => ({
      id: pedido.id,
      cliente: pedido.cliente,
      produtos: pedido.produtos,
      total: pedido.total,
      status: pedido.status,
      pagamentoStatus: pedido.pagamentoStatus,
      senha: pedido.senha,
    }));
  }

  public async buscarPedido(id: string): Promise<PedidoProdutos | null> {
    const pedido = await this.dbConnection.buscarUm<Pedido>({ _id: id });
    if (!pedido) return null;
    return {
      cliente: pedido.cliente,
      produtos: pedido.produtos,
      status: pedido.status,
      total: pedido.total,
      senha: pedido.senha,
      pagamentoStatus: pedido.pagamentoStatus,
    };
  }

  public async criar(pedido: Omit<Pedido, 'id'>): Promise<Pedido> {
    const produtoCriado = await this.dbConnection.criar<{
      _id: string;
    }>({
      ...pedido,
      status: pedido.status.status,
      pagamentoStatus: pedido.pagamentoStatus.status,
    });
    return new Pedido(
      produtoCriado._id,
      pedido.cliente,
      pedido.produtos,
      pedido.total,
      pedido.status,
      pedido.pagamentoStatus,
      pedido.senha
    );
  }

  public async editar(params: {
    id: string;
    value: object;
  }): Promise<Pedido | null> {
    const produtoAtualizado = await this.dbConnection.editar<Pedido>(params);
    if (!produtoAtualizado) return null;
    return new Pedido(
      produtoAtualizado.id,
      produtoAtualizado.cliente,
      produtoAtualizado.produtos,
      produtoAtualizado.total,
      produtoAtualizado.status,
      produtoAtualizado.pagamentoStatus,
      produtoAtualizado.senha
    );
  }
}
