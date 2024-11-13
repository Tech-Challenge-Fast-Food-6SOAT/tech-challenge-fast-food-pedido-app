/* eslint-disable no-underscore-dangle */
type StatusEnum = 'Em preparação' | 'Finalizado' | 'Pronto' | 'Recebido';

export class Status {
  public constructor(private readonly _status: StatusEnum) {}

  public get status(): StatusEnum {
    return this._status;
  }
}
