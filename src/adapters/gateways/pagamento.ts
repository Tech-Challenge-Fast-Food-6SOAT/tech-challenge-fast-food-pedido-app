import type { Pedido } from '../../domain/entities';
import type { IPagamentoGateway } from '../../interfaces/gateways';
import type { IMicrosservicoPagamento } from '../../interfaces/microsservico';

export class PagamentoGateway implements IPagamentoGateway {
  public constructor(
    private readonly microsservicoPagamento: IMicrosservicoPagamento
  ) {}

  public async gerarPagamento(pedido: Pedido): Promise<{ qrCode: string }> {
    return this.microsservicoPagamento.gerarPagamento(pedido);
  }
}
