import type { IProdutoGateway } from '../../interfaces/gateways';
import type { IMicrosservicoProduto } from '../../interfaces/microsservico';
import type { Produto } from '../../types';

export class ProdutoGateway implements IProdutoGateway {
  public constructor(
    private readonly microsservicoProduto: IMicrosservicoProduto
  ) {}

  public async buscarProdutoPorId(id: string): Promise<Produto> {
    return this.microsservicoProduto.buscarProdutoPorId(id);
  }
}
