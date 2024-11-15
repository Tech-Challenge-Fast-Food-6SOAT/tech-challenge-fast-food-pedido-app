import type { Pedido } from '../../domain/entities/pedido';
import type { PedidoProdutos } from '../../types';

export interface IPedidoGateway {
  buscarPedidos: () => Promise<PedidoProdutos[]>;
  buscarPedido: (id: string) => Promise<PedidoProdutos | null>;
  criar: (pedido: Omit<Pedido, 'id'>) => Promise<Pedido>;
  editar: (params: { id: string; value: object }) => Promise<Pedido | null>;
}
