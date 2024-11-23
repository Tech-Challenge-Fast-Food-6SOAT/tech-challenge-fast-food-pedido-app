/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { SecretsGateway } from '@/adapters/gateways';
import { MicrosservicoProduto } from '@/infra/microsservico';

jest.mock('@/adapters/gateways/secrets');

describe('MicrosservicoProduto', () => {
  let mockAxios: AxiosMockAdapter;
  let secretsGateway: jest.Mocked<SecretsGateway>;
  let microsservicoProduto: MicrosservicoProduto;

  beforeEach(() => {
    mockAxios = new AxiosMockAdapter(axios);
    secretsGateway = new SecretsGateway() as jest.Mocked<SecretsGateway>;
    microsservicoProduto = new MicrosservicoProduto(secretsGateway);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should make a produto request successfully', async () => {
    const id = '123';
    const baseUrl = 'http://mocked-url.com';
    const produto = {
      nome: 'NomeProduto',
      preco: 10,
      descricao: 'DescricaoProduto',
    };
    const axiosResponse = { status: 'success', data: produto };
    (secretsGateway.getSecretValue as jest.Mock).mockResolvedValue(baseUrl);

    mockAxios
      .onGet(`${baseUrl}/produtos/produto/${id}`)
      .reply(200, axiosResponse);

    const result = await microsservicoProduto.buscarProdutoPorId(id);

    expect(result).toEqual(axiosResponse);
    expect(secretsGateway.getSecretValue).toHaveBeenCalledWith(
      'LANCHONETE_API'
    );
  });
});
