import type { Pedido } from '../../domain/entities';

export interface IMicrosservicoPagamento {
  gerarPagamento: (pedido: Pedido) => Promise<{ qrCode: string }>;
}
