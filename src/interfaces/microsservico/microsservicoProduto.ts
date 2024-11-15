import type { Produto } from '../../types';

export interface IMicrosservicoProduto {
  buscarProdutoPorId: (id: string) => Promise<Produto>;
}
