/* eslint-disable @typescript-eslint/unbound-method */
import type { Model as ModelType } from 'mongoose';

import { MongoDbConnection } from '@/infra/database/mongodb/db-connections/db-connections';

describe('MongoDbConnection', () => {
  const modelMock = {
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
  } as unknown as jest.Mocked<ModelType<unknown>>;
  const mongoDbConnection = new MongoDbConnection(
    modelMock as unknown as ModelType<unknown>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('editar', () => {
    it('should update a document and return the updated document', async () => {
      const params = { id: '123', value: { status: 'Em preparação' } };
      const updatedModel = { _id: '123', ...params.value };
      modelMock.findByIdAndUpdate.mockResolvedValue(updatedModel);

      const result = await mongoDbConnection.editar(params);

      expect(modelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        params.value,
        { new: true }
      );
      expect(result).toEqual(updatedModel);
    });
  });

  describe('buscar', () => {
    it('should find documents based on params and return them', async () => {
      const params = { id: '123' };
      const foundModels = [{ _id: '123', status: 'Em preparação' }];
      modelMock.find.mockResolvedValue(foundModels);

      const result = await mongoDbConnection.buscar(params);

      expect(modelMock.find).toHaveBeenCalledWith(params);
      expect(result).toEqual(foundModels);
    });
  });

  describe('buscarUm', () => {
    it('should find a single document based on params and return it', async () => {
      const params = { _id: '123' };
      const foundModel = { _id: '123', status: 'Em preparação' };
      modelMock.findOne.mockResolvedValue(foundModel);

      const result = await mongoDbConnection.buscarUm(params);

      expect(modelMock.findOne).toHaveBeenCalledWith(params);
      expect(result).toEqual(foundModel);
    });
  });

  describe('excluir', () => {
    it('should delete a document by ID', async () => {
      const id = '123';
      modelMock.findByIdAndDelete.mockResolvedValue(undefined);

      await mongoDbConnection.excluir(id);

      expect(modelMock.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
