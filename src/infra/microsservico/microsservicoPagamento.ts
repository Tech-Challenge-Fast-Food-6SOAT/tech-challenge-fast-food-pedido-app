import axios from 'axios';

import type { Pedido } from '../../domain/entities';
import type { ISecretsGateway } from '../../interfaces/gateways';
import type { IMicrosservicoPagamento } from '../../interfaces/microsservico';
import { Logger } from '../logs/logger';

export class MicrosservicoPagamento implements IMicrosservicoPagamento {
  public constructor(private readonly secretsGateway: ISecretsGateway) {}

  public async gerarPagamento(pedido: Pedido): Promise<{ qrCode: string }> {
    const baseUrl = await this.secretsGateway.getSecretValue('LANCHONETE_API');
    const data = await axios
      .post<{ qrCode: string }>(`${baseUrl}/pagamento/gerar`, {
        pedido: {
          id: pedido.id,
          total: pedido.total,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
    return data;
  }
}
