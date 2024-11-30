import type { Pedido } from '../../domain/entities';

export interface IPagamentoGateway {
  gerarPagamento: (pedido: Pedido) => Promise<{ qrCode: string }>;
}
