import axios from 'axios';

import type { IMicrosservicoProduto } from '../../interfaces/microsservico';
import type { Produto } from '../../types';
import { Logger } from '../logs/logger';

export class MicrosservicoProduto implements IMicrosservicoProduto {
  public async buscarProdutoPorId(id: string): Promise<Produto> {
    const data = await axios
      .get<Produto>(`http://localhost:5000/produto/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
    return data;
  }
}
