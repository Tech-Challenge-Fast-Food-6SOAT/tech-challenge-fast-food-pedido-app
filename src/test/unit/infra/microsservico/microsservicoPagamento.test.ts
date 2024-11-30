/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { SecretsGateway } from '@/adapters/gateways';
import type { Pedido } from '@/domain/entities';
import { MicrosservicoPagamento } from '@/infra/microsservico';

jest.mock('@/adapters/gateways/secrets');

describe('MicrosservicoPagamento', () => {
  let mockAxios: AxiosMockAdapter;
  let secretsGateway: jest.Mocked<SecretsGateway>;
  let microsservicoPagamento: MicrosservicoPagamento;

  const pedido = {
    id: '123',
    cliente: '12345678910',
    status: 'Pronto',
    total: 10,
    pagamentoStatus: 'Aprovado',
    senha: '0001',
  } as unknown as Pedido;

  beforeEach(() => {
    mockAxios = new AxiosMockAdapter(axios);
    secretsGateway = new SecretsGateway() as jest.Mocked<SecretsGateway>;
    microsservicoPagamento = new MicrosservicoPagamento(secretsGateway);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should make a payment request successfully', async () => {
    const baseUrl = 'http://mocked-url.com';
    const axiosResponse = { status: 'success', data: { qrCode: '123' } };
    (secretsGateway.getSecretValue as jest.Mock).mockResolvedValue(baseUrl);
    mockAxios.onPost(`${baseUrl}/pagamento/gerar`).reply(200, axiosResponse);

    const result = await microsservicoPagamento.gerarPagamento(pedido);

    expect(secretsGateway.getSecretValue).toHaveBeenCalledWith(
      'LANCHONETE_API'
    );
    expect(result).toEqual(axiosResponse);
  });
});
