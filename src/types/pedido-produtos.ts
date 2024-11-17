import type { PagamentoStatus, Status } from '../domain/value-objects';
import type { Produto } from './produto';

export interface PedidoProdutos {
  cliente: string | null;
  produtos: {
    produto: Produto;
    quantidade: number;
  }[];
  total: number;
  status: Status;
  pagamentoStatus: PagamentoStatus;
  senha: string;
}
