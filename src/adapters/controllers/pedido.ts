import type { CheckoutUseCase } from '../../application/usecases/checkout';
import type { PedidoUseCase } from '../../application/usecases/pedido';
import type { HttpRequest, HttpResponse } from '../../interfaces/http';

export class PedidoController {
  public constructor(
    private readonly pedidoUseCase: PedidoUseCase,
    private readonly checkoutUseCase: CheckoutUseCase
  ) {}

  public async buscarPedidos(request: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidos = await this.pedidoUseCase.buscarPedidos();

      return {
        data: pedidos,
        statusCode: 200,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }

  public async atualizarStatusPedido(
    request: HttpRequest
  ): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const { status } = request.body;

      const pedido = await this.pedidoUseCase.atualizarStatusPedido({
        id,
        status,
      });

      return {
        data: {
          status: pedido?.status,
          senha: pedido?.senha,
        },
        statusCode: 200,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }

  public async statusPagamento(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const statusPagamento = await this.pedidoUseCase.statusPagamento(id);

      return {
        data: {
          statusPagamento,
        },
        statusCode: 200,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }

  public async atualizarStatusPagamento(
    request: HttpRequest
  ): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const { pagamentoStatus } = request.body;

      await this.pedidoUseCase.atualizarStatusPagamento({
        id,
        pagamentoStatus,
      });

      return {
        data: {
          message: 'Status do pagamento atualizado com sucesso!',
        },
        statusCode: 200,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }

  public async checkout(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { produtos } = request.body;
      const { cpf } = request.headers;

      const data = await this.checkoutUseCase.checkout({ produtos, cpf });

      return {
        data,
        statusCode: 201,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }
}
