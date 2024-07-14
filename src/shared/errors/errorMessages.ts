export type ErrorMessage = {
  message: string;
  detail: string;
};

export type ErrorMessages = {
  [errorName: string]: ErrorMessage;
};
