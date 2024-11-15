import axios from 'axios';

import type { Pedido } from '../../domain/entities';
import type { IMicrosservicoPagamento } from '../../interfaces/microsservico';
import { Logger } from '../logs/logger';

export class MicrosservicoPagamento implements IMicrosservicoPagamento {
  public async gerarPagamento(pedido: Pedido): Promise<{ qrCode: string }> {
    const data = await axios
      .post<{ qrCode: string }>('http://localhost:4000/pagamento', {
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
