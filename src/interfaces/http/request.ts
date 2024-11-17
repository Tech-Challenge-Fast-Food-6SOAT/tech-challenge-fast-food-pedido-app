import type { PagamentoStatus, Status } from '../../domain/value-objects';

export interface HttpRequest<T = any> {
  body: {
    produtos: { id: string; quantidade: number }[];
    pagamentoStatus: PagamentoStatus;
    status: Status;
  };
  headers: T;
  params: {
    id: string;
  };
  query: T;
}
