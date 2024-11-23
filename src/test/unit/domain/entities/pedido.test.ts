import { Pedido } from '@/domain/entities';
import { PagamentoStatus, Status } from '@/domain/value-objects';
import type { Produto } from '@/types';

describe('Pedido', () => {
  const produto: Produto = {
    nome: 'NomeProduto',
    preco: 100,
    descricao: 'Descrição do produto',
  };

  const produtos = [{ produto, quantidade: 2 }];
  const status = new Status('Recebido');
  const pagamentoStatus = new PagamentoStatus('Pendente');
  const pedido = new Pedido(
    'ID321',
    '12345678910',
    produtos,
    200,
    status,
    pagamentoStatus,
    '0001'
  );

  it('should create a Pedido instance', () => {
    expect(pedido).toBeInstanceOf(Pedido);
  });

  it('should return the correct id', () => {
    expect(pedido.id).toBe('ID321');
  });

  it('should return the correct cliente', () => {
    expect(pedido.cliente).toBe('12345678910');
  });

  it('should return the correct produtos', () => {
    expect(pedido.produtos).toEqual(produtos);
  });

  it('should return the correct total', () => {
    expect(pedido.total).toBe(200);
  });

  it('should return the correct status', () => {
    expect(pedido.status).toBe(status);
  });

  it('should return the correct pagamentoStatus', () => {
    expect(pedido.pagamentoStatus).toBe(pagamentoStatus);
  });

  it('should return the correct senha', () => {
    expect(pedido.senha).toBe('0001');
  });
});
