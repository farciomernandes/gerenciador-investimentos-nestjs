import { type NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Setups } from './setups';
import { AppModule } from './app.module';
import { PinoLogger } from '@infra/logger/pino.logger';

async function bootstrap() {
  const configModule: NestApplicationOptions = {};

  if (process.env.NODE_ENV !== 'development') {
    configModule.logger = new PinoLogger();
  }

  const app = await NestFactory.create(AppModule, configModule);

  await Setups.setApp(app).middlewares().startDependencies();

  if (process.env.NODE_ENV !== 'production') {
    Setups.setApp(app).swagger();
  }

  await app.listen(process.env.APP_PORT ?? 3000);
}

bootstrap().catch((e) => {
  console.error(e);
});
