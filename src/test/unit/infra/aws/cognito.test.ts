/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { Cognito, SecretsManager } from '@/infra/aws';

jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('@/infra/aws/secretsManager');

describe('Cognito', () => {
  let cognito: Cognito;
  let secretsManager: jest.Mocked<SecretsManager>;
  let mockSend: jest.Mock;

  beforeEach(() => {
    secretsManager = new SecretsManager() as jest.Mocked<SecretsManager>;
    mockSend = jest.fn();
    (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
    (SecretsManager as jest.Mock).mockImplementation(() => secretsManager);
    cognito = new Cognito();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user details', async () => {
    const username = 'john';
    const userPoolId = 'user-pool-id';
    const userDetails = { Username: username };

    secretsManager.getSecretValue.mockResolvedValueOnce(userPoolId);
    mockSend.mockResolvedValueOnce(userDetails);

    const result = await cognito.adminGetUser(username);

    expect(secretsManager.getSecretValue).toHaveBeenCalledWith(
      'COGNITO_USER_POOL_ID'
    );
    expect(mockSend).toHaveBeenCalledWith(expect.any(AdminGetUserCommand));
    expect(result).toEqual(userDetails);
  });

  it('should sign up a new user', async () => {
    const username = 'john';
    const name = 'John';
    const email = 'john@example.com';
    const clientId = 'client-id';
    const signUpResponse = { UserConfirmed: true };

    secretsManager.getSecretValue.mockResolvedValueOnce(clientId);
    mockSend.mockResolvedValueOnce(signUpResponse);

    const result = await cognito.signUp({ username, name, email });

    expect(secretsManager.getSecretValue).toHaveBeenCalledWith(
      'COGNITO_CLIENT_ID'
    );
    expect(mockSend).toHaveBeenCalledWith(expect.any(SignUpCommand));
    expect(result).toEqual(signUpResponse);
  });
});
