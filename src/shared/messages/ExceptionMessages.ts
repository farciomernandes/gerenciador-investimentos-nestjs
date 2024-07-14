type ExceptionMessage = string;

type ExceptionArguments = {
  min?: number;
  max?: number;
  version?: string;
  format?: string;
};

type ExceptionMessages = {
  [exceptionName: string]: (
    prop: string,
    args?: ExceptionArguments,
  ) => ExceptionMessage;
};

export const ExceptionMessages: ExceptionMessages = {
  isNotEmpty: (prop) => `${prop} é obrigatório.`,
  isString: (prop) => `${prop} deve ser uma string.`,
  isAlphaWithWhitespaces: (prop) =>
    `${prop} deve conter apenas letras e espaços.`,
  isEmail: (prop) => `${prop} deve ser um email válido.`,
  isNumber: (prop) => `${prop} deve ser um número.`,
  isBoolean: (prop) => `${prop} deve ser um booleano`,
};
