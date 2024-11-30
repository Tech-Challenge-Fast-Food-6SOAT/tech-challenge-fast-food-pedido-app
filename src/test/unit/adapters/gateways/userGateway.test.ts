/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import type { SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

import { UserGateway } from '@/adapters/gateways';
import { Cognito } from '@/infra/aws';
import { Logger } from '@/infra/logs/logger';

jest.mock('@/infra/aws');
jest.mock('@/infra/logs/logger', () => ({
  Logger: { error: jest.fn() },
}));

describe('UserGateway', () => {
  let userGateway: UserGateway;
  let cognito: jest.Mocked<Cognito>;

  beforeEach(() => {
    cognito = new Cognito() as jest.Mocked<Cognito>;
    (Cognito as jest.Mock).mockImplementation(() => cognito);
    userGateway = new UserGateway();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getUser', () => {
    const cpf = '12345678910';
    it('should get user details', async () => {
      const userDetails = { Username: 'John' };
      cognito.adminGetUser.mockResolvedValue(userDetails);

      const result = await userGateway.getUser(cpf);

      expect(result).toEqual(userDetails);
    });

    it('should return null if a error occurs while getting user details', async () => {
      cognito.adminGetUser.mockRejectedValue(new Error('Test error'));

      const result = await userGateway.getUser(cpf);

      expect(result).toBeNull();
    });
  });

  describe('signUpUser', () => {
    const cpf = '12345678910';
    const email = 'john@email.com';
    const name = 'John';

    it('should sign up a new user', async () => {
      const signUpResponse = {
        UserConfirmed: true,
      } as SignUpCommandOutput;
      cognito.signUp.mockResolvedValue(signUpResponse);

      await userGateway.signUpUser({ cpf, email, name });

      expect(cognito.signUp).toHaveBeenCalledWith({
        username: cpf,
        email,
        name,
      });
    });

    it('should log error if a error occurs while signing up a new user', async () => {
      cognito.signUp.mockRejectedValue(new Error('Test error'));

      await userGateway.signUpUser({ cpf, email, name });

      expect(Logger.error).toHaveBeenCalledWith('Test error');
    });

    it('should log error if a unknown error occurs while signing up a new user', async () => {
      cognito.signUp.mockRejectedValue({});
      await userGateway.signUpUser({ cpf, email, name });

      expect(Logger.error).toHaveBeenCalledWith('An unknown error occurred');
    });
  });
});
