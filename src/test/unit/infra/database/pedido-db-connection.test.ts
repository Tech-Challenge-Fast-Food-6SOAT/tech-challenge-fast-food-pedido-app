/* eslint-disable @typescript-eslint/unbound-method */
import { MongoDbConnection } from '@/infra/database/mongodb/db-connections/db-connections';
import { PedidoDbConnection } from '@/infra/database/mongodb/db-connections/pedido-db-connection';
import { PedidoModel } from '@/infra/database/mongodb/models';

jest.mock('@/infra/database/mongodb/models');
jest.mock('@/infra/database/mongodb/db-connections/db-connections', () => ({
  MongoDbConnection: jest.fn(),
}));

jest.mock('@/infra/database/mongodb', () => ({
  mongoConnection: {
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      aggregate: jest.fn(),
    }),
  },
}));

describe('PedidoDbConnection', () => {
  it('should extend MongoDbConnection with PedidoModel', () => {
    const pedidoDbConnection = new PedidoDbConnection();

    expect(MongoDbConnection).toHaveBeenCalledWith(PedidoModel);
    expect(pedidoDbConnection).toBeInstanceOf(MongoDbConnection);
  });

  it('should call PedidoModel.aggregate with the correct pipeline', async () => {
    const pedidoDbConnection = new PedidoDbConnection();
    const pipeline = [
      {
        $match: {
          category: { $ne: 'Finalizado' },
        },
      },
      {
        $addFields: {
          statusCustomOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'Pronto'] }, then: 0 },
                { case: { $eq: ['$status', 'Em Preparação'] }, then: 1 },
              ],
              default: 2,
            },
          },
        },
      },
      { $addFields: { id: '$_id' } },
      { $sort: { statusCustomOrder: 1, createdAt: 1 } },
    ];

    await pedidoDbConnection.buscar();

    expect(PedidoModel.aggregate).toHaveBeenCalledWith(pipeline);
  });
});
