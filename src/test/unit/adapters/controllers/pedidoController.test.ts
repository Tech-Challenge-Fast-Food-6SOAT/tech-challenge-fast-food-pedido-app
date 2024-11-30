/* eslint-disable @typescript-eslint/init-declarations */
import { PedidoController } from '@/adapters/controllers';
import type { CheckoutUseCase, PedidoUseCase } from '@/application/usecases';
import type { HttpRequest, HttpResponse } from '@/interfaces/http';

describe('PedidoController', () => {
  const pedidoUseCase = {
    buscarPedidos: jest.fn(),
    atualizarStatusPedido: jest.fn(),
    statusPagamento: jest.fn(),
    atualizarStatusPagamento: jest.fn(),
  } as unknown as PedidoUseCase;
  const checkoutUseCase = {
    checkout: jest.fn(),
  } as unknown as CheckoutUseCase;
  const pedidoController = new PedidoController(pedidoUseCase, checkoutUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('atualizarStatusPedido', () => {
    it('should return 200 if status is updated', async () => {
      const pedido = {
        id: '123',
        status: 'Pronto',
        senha: '0001',
      };
      (pedidoUseCase.atualizarStatusPedido as jest.Mock).mockResolvedValue(
        pedido
      );

      const request = {
        body: { status: 'Pronto' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pedidoController.atualizarStatusPedido(request);

      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual({
        status: pedido.status,
        senha: pedido.senha,
      });
    });

    it('should return 500 if an error occurs', async () => {
      (pedidoUseCase.atualizarStatusPedido as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = {
        body: { status: 'Pronto' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pedidoController.atualizarStatusPedido(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });

    it('should return 500 and error message: Unknown error', async () => {
      (pedidoUseCase.atualizarStatusPedido as jest.Mock).mockRejectedValue(
        'Erro interno'
      );
      const request = {
        body: { status: 'Pronto' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pedidoController.atualizarStatusPedido(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Unknown error' });
    });
  });

  describe('statusPagamento', () => {
    it('should return 200 and statusPagamento', async () => {
      const statusPagamento = 'Aprovado';
      (pedidoUseCase.statusPagamento as jest.Mock).mockResolvedValue(
        statusPagamento
      );
      const request = { params: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await pedidoController.statusPagamento(
        request
      );

      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual({ statusPagamento });
    });

    it('should return 500 if an error occurs', async () => {
      (pedidoUseCase.statusPagamento as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = { params: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await pedidoController.statusPagamento(
        request
      );

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });

    it('should return 500 and error message: Unknown error', async () => {
      (pedidoUseCase.statusPagamento as jest.Mock).mockRejectedValue(
        'Erro interno'
      );
      const request = { params: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await pedidoController.statusPagamento(
        request
      );

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Unknown error' });
    });
  });

  describe('atualizarStatusPagamento', () => {
    it('should return 200 if statusPagamento is updated', async () => {
      const message = 'Status do pagamento atualizado com sucesso!';
      (pedidoUseCase.atualizarStatusPagamento as jest.Mock).mockResolvedValue(
        message
      );

      const request = {
        body: { pagamentoStatus: 'Aprovado' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pedidoController.atualizarStatusPagamento(request);

      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual({ message });
    });

    it('should return 500 if an error occurs', async () => {
      (pedidoUseCase.atualizarStatusPagamento as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = {
        body: { pagamentoStatus: 'Aprovado' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pedidoController.atualizarStatusPagamento(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });

    it('should return 500 and error message: Unknown error', async () => {
      (pedidoUseCase.atualizarStatusPagamento as jest.Mock).mockRejectedValue(
        'Erro interno'
      );
      const request = {
        body: { pagamentoStatus: 'Aprovado' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pedidoController.atualizarStatusPagamento(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Unknown error' });
    });
  });

  describe('checkout', () => {
    it('should return 200 and data if checkout is successful', async () => {
      const data = { id: '321', senha: '0001', qrCode: 'qrCode' };
      (checkoutUseCase.checkout as jest.Mock).mockResolvedValue(data);

      const request = {
        body: {
          cliente: { cpf: '12345678900' },
          produtos: [{ id: '123', quantidade: 2 }],
        },
      } as HttpRequest;
      const response: HttpResponse = await pedidoController.checkout(request);

      expect(response.statusCode).toBe(201);
      expect(response.data).toEqual(data);
    });

    it('should return 500 if an error occurs', async () => {
      (checkoutUseCase.checkout as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = {
        body: {
          cliente: { cpf: '12345678900' },
          produtos: [{ id: '123', quantidade: 2 }],
        },
      } as HttpRequest;
      const response: HttpResponse = await pedidoController.checkout(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });

    it('should return 500 and error message: Unknown error', async () => {
      (checkoutUseCase.checkout as jest.Mock).mockRejectedValue('Erro interno');
      const request = {
        body: {
          cliente: { cpf: '12345678900' },
          produtos: [{ id: '123', quantidade: 2 }],
        },
      } as HttpRequest;
      const response: HttpResponse = await pedidoController.checkout(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Unknown error' });
    });
  });
});
