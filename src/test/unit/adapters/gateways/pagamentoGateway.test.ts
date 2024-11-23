import { PagamentoGateway } from '@/adapters/gateways';
import type { Pedido } from '@/domain/entities';
import type { IMicrosservicoPagamento } from '@/interfaces/microsservico';

describe('PagamentoGateway', () => {
  const microsservicoPagamento = {
    gerarPagamento: jest.fn(),
  } as unknown as IMicrosservicoPagamento;
  const pagamentoGateway = new PagamentoGateway(microsservicoPagamento);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gerarPagamento', () => {
    it('should return produto document', async () => {
      const pedido = {
        id: '123',
        produtos: [
          {
            produto: {
              nome: 'NomeProduto',
              preco: 10,
              descricao: 'Descrição do Produto',
            },
            quantidade: 1,
          },
        ],
        total: 10,
        status: 'Recebido',
        pagamentoStatus: 'Aprovado',
        senha: '0001',
      } as unknown as Pedido;

      const qrCode = 'qrCode';
      (microsservicoPagamento.gerarPagamento as jest.Mock).mockResolvedValue(
        qrCode
      );
      const result = await pagamentoGateway.gerarPagamento(pedido);
      expect(result).toEqual(qrCode);
      expect(microsservicoPagamento.gerarPagamento).toHaveBeenCalledWith(
        pedido
      );
      expect(microsservicoPagamento.gerarPagamento).toHaveBeenCalledTimes(1);
    });
  });
});
