import axios from 'axios';

import type { ISecretsGateway } from '../../interfaces/gateways';
import type { IMicrosservicoProduto } from '../../interfaces/microsservico';
import type { Produto } from '../../types';
import { Logger } from '../logs/logger';

export class MicrosservicoProduto implements IMicrosservicoProduto {
  public constructor(private readonly secretsGateway: ISecretsGateway) {}

  public async buscarProdutoPorId(id: string): Promise<Produto> {
    const baseUrl = await this.secretsGateway.getSecretValue('LANCHONETE_API');
    const data = await axios
      .get<Produto>(`${baseUrl}/produtos/produto/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
    return data;
  }
}
