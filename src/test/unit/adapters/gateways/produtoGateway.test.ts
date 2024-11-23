import { ProdutoGateway } from '@/adapters/gateways';
import type { IMicrosservicoProduto } from '@/interfaces/microsservico';

describe('ProdutoGateway', () => {
  const microsservicoProduto = {
    buscarProdutoPorId: jest.fn(),
  } as unknown as IMicrosservicoProduto;
  const produtoGateway = new ProdutoGateway(microsservicoProduto);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarProdutoPorId', () => {
    it('should return produto document', async () => {
      const produto = {
        nome: 'NomeProduto',
        preco: 10,
        descricao: 'Descrição do Produto',
      };
      (microsservicoProduto.buscarProdutoPorId as jest.Mock).mockResolvedValue(
        produto
      );
      const result = await produtoGateway.buscarProdutoPorId('123');
      expect(result).toEqual(produto);
      expect(microsservicoProduto.buscarProdutoPorId).toHaveBeenCalledWith(
        '123'
      );
      expect(microsservicoProduto.buscarProdutoPorId).toHaveBeenCalledTimes(1);
    });
  });
});
