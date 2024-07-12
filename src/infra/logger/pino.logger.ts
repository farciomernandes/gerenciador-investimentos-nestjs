import { type LoggerService } from '@nestjs/common';
import pino from 'pino';

export class PinoLogger implements LoggerService {
  private readonly logger: pino.Logger = pino({
    level: 'debug',
    formatters: {
      level(_label, number) {
        return { level: pino.levels.labels[number] };
      },
    },
  });


  log(message: any, ...optionalParams: any[]) {
    this.logger.info(optionalParams, message);
  }


  error(message: any, ...optionalParams: any[]) {
    this.logger.error(optionalParams, message);
  }


  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(optionalParams, message);
  }


  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(optionalParams, message);
  }
}
