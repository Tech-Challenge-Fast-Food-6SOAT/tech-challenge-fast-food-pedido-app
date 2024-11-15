import type { Pedido } from '../../domain/entities';

export interface IMicrosservicoPagamentoGateway {
  gerarPagamento: (pedido: Pedido) => Promise<{ qrCode: string }>;
}
