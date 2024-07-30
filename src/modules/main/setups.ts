import { NewrelicInterceptor } from '@infra/newrelic/newrelic.interceptor';
import {
  type INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

export abstract class Setups {
  static app: INestApplication;
  static configService: ConfigService;

  static setApp(app: INestApplication): typeof Setups {
    this.app = app;
    this.configService = this.app.get(ConfigService);
    return this;
  }

  static swagger(): typeof Setups {
    this.app.enableVersioning({ type: VersioningType.URI });

    const appName =
      this.configService.get<string>('APP_NAME', 'New application') ||
      'New application';
    const appDescription =
      this.configService.get<string>(
        'APP_DESCRIPTION',
        'The new application description',
      ) || 'The new application description';
    const appVersion =
      this.configService.get<string>('API_VERSION', '1') || '1';

    const config = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(appDescription)
      .setVersion(appVersion)
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
    const appName = this.configService.get<string>('APP_NAME') || 'app';
    const username =
      this.configService.get<string>('SWAGGER_USERNAME', appName) || appName;
    const password =
      this.configService.get<string>('SWAGGER_PASSWORD', `pass-${appName}`) ||
      `pass-${appName}`;
    const challenge: { [key: string]: string } = {};
    challenge[username] = password;
    return challenge;
  }

  static middlewares(): typeof Setups {
    this.app.useGlobalPipes(new ValidationPipe());
    return this;
  }

  static async startDependencies(): Promise<void> {
    this.app.enableShutdownHooks();
    this.app.useGlobalInterceptors(new NewrelicInterceptor());
  }
}
