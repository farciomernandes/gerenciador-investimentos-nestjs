import {
  type INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import process from 'process';
import * as basicAuth from 'express-basic-auth';

export abstract class Setups {
  static app: INestApplication;

  static setApp(app: INestApplication): typeof Setups {
    this.app = app;
    return this;
  }

  static swagger(): typeof Setups {
    this.app.enableVersioning({ type: VersioningType.URI });
    const config = new DocumentBuilder()
      .setTitle('New application')
      .setDescription('The new application description')
      .setVersion('1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.app, config);

    const routeSwagger: string = '/docs';
    this.app.use(
      [`${routeSwagger}*`],
      basicAuth.default({
        challenge: true,
        users: this.createChallenge(),
      }),
    );
    SwaggerModule.setup(`${routeSwagger}`, this.app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        defaultModelsExpandDepth: 0,
        docExpansion: 'none',
      },
    });

    return this;
  }

  static createChallenge() {
    const appName = process.env.APP_NAME as string;
    const username = (process.env.SWAGGER_USERNAME as string) || appName;
    const password =
      (process.env.SWAGGER_PASSWORD as string) || `pass-${appName}`;
    const challenge = {};
    challenge[username] = password;
    return challenge;
  }

  static microservice(): typeof Setups {
    const configService = this.app.get(ConfigService);
    const defaultBroker = 'localhost:9092';

    this.app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: '<client-id>',
          brokers: [configService.get('COMMON_KAFKA_BROKERS', defaultBroker)],
        },
        consumer: { groupId: '<group-id>' },
      },
    });
    return this;
  }

  static middlewares(): typeof Setups {
    this.app.useGlobalPipes(new ValidationPipe());
    return this;
  }

  static async startDependencies(): Promise<void> {
    this.app.enableShutdownHooks();
    await this.app.startAllMicroservices();
  }
}
