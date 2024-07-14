import { ErrorMessages } from 'src/shared/errors/errorMessages';

export const AuthErrorMessages: ErrorMessages = {
  InvalidLogin: {
    message: 'Dados de acesso inválidos.',
    detail: 'A combinação de email e password é inválida.',
  },
  AuthenticationFailed: {
    message: 'Autenticação falhou.',
    detail: 'Faça login novamente.',
  },
  TokenNotProvided: {
    message: 'Autenticação falhou.',
    detail: 'É necessário informar o token de autenticação.',
  },
};
