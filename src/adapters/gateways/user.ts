import { Logger } from '@/infra/logs/logger';

import { Cognito } from '../../infra/aws';
import type { IUserGateway } from '../../interfaces/gateways';

export class UserGateway implements IUserGateway {
  private readonly cognito: Cognito;

  public constructor() {
    this.cognito = new Cognito();
  }

  public async getUser(cpf: string): Promise<object | null> {
    try {
      const user = await this.cognito.adminGetUser(cpf);
      return user;
    } catch (error) {
      return null;
    }
  }

  public async signUpUser({
    cpf,
    email,
    name,
  }: {
    cpf: string;
    email?: string;
    name?: string;
  }): Promise<void> {
    try {
      await this.cognito.signUp({
        username: cpf,
        email,
        name,
      });
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(error.message);
      } else {
        Logger.error('An unknown error occurred');
      }
    }
  }
}
