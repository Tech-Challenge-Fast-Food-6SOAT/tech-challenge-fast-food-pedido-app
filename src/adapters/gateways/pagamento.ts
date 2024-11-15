import type { Pedido } from '../../domain/entities';
import type { IPagamentoGateway } from '../../interfaces/gateways';
import type { IMicrosservicoPagamentoGateway } from '../../interfaces/microsservicoPagamento';

export class PagamentoGateway implements IPagamentoGateway {
  public constructor(
    private readonly microsservicoPagamentoGateway: IMicrosservicoPagamentoGateway
  ) {}

  public async gerarPagamento(pedido: Pedido): Promise<{ qrCode: string }> {
    return this.microsservicoPagamentoGateway.gerarPagamento(pedido);
  }
}
