import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import * as process from 'process';

@Controller({
  version: VERSION_NEUTRAL,
})
export class MainController {
  @Get('')
  root() {
    const appName = process.env.APP_NAME as string;
    const nodeEnv = process.env.NODE_ENV as string;
    return `${appName} - ${nodeEnv}`;
  }
}
