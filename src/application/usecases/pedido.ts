import type { PedidoGateway } from '../../adapters/gateways';
import type { Pedido } from '../../domain/entities';
import type { PedidoProdutos } from '../../types';
import type { PagamentoStatus, Status } from '../../value-objects';

export class PedidoUseCase {
  public constructor(private readonly pedidoGateway: PedidoGateway) {}

  public async buscarPedidos(): Promise<PedidoProdutos[]> {
    return this.pedidoGateway.buscarPedidos();
  }

  public async criar({
    cliente,
    produtos,
    total,
    status,
    pagamentoStatus,
    senha,
  }: Omit<Pedido, 'id'>): Promise<Pedido> {
    return this.pedidoGateway.criar({
      cliente,
      produtos,
      total,
      status,
      pagamentoStatus,
      senha,
    });
  }

  public async atualizarStatusPedido(params: {
    id: string;
    status: Status;
  }): Promise<PedidoProdutos | null> {
    const pedido = await this.pedidoGateway.buscarPedido(params.id);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    return this.pedidoGateway.editar({
      id: params.id,
      value: { status: params.status },
    });
  }

  public async statusPagamento(id: string): Promise<PagamentoStatus> {
    const pedido = await this.pedidoGateway.buscarPedido(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
    return pedido.pagamentoStatus;
  }
}
