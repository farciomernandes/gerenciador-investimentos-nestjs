import config from './jest.config';

export default {
  ...config,
  testRegex: '^((?!controller|repository).)+\\.spec\\.ts$',
};
