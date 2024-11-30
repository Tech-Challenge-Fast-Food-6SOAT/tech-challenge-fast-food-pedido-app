export interface IUserGateway {
  getUser: (cpf: string) => Promise<object | null>;
  signUpUser: ({
    cpf,
    email,
    name,
  }: {
    cpf: string;
    email?: string;
    name?: string;
  }) => Promise<void>;
}
