import type { Produto } from '../../types';

export interface IProdutoGateway {
  buscarProdutoPorId: (id: string) => Promise<Produto>;
}
