import { PedidoModel } from '../models';
import { MongoDbConnection } from './db-connections';

export class PedidoDbConnection extends MongoDbConnection {
  public constructor() {
    super(PedidoModel);
  }

  public async buscar<T = any>(): Promise<T[]> {
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

    return PedidoModel.aggregate(pipeline as []);
  }
}
