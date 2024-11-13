import mongoose from 'mongoose';

import { mongoConnection } from '../index';

const status = ['Recebido', 'Em preparação', 'Pronto', 'Finalizado'];
const pagamentoStatus = ['Aprovado', 'Recusado', 'Pendente'];

const Schema = new mongoose.Schema(
  {
    cliente: {
      type: String,
    },
    produtos: [
      {
        produto: {
          nome: {
            required: true,
            type: String,
          },
          preco: {
            required: true,
            type: Number,
          },
          descricao: {
            required: true,
            type: String,
          },
        },
        quantidade: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [...status],
      required: true,
    },
    pagamentoStatus: {
      type: String,
      enum: [...pagamentoStatus],
      required: true,
    },
    senha: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

Schema.index({ status: 1, createdAt: 1 });

export const PedidoModel = mongoConnection.model('pedidos', Schema);
