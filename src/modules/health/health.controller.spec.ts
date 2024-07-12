import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

describe('HealthControllerUnitTest', () => {
  let app: INestApplication;
  let healthController: HealthController;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HealthController,
        {
          provide: HealthCheckService,
          useValue: {
            check: () => ({ response: 'ok' }),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: () => ({ response: 'ok' }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    healthController = app.get(HealthController);
  });
  afterAll(async () => {
    await app.close();
  });

  it('should check health at default port successfully', async () => {
    expect(healthController.check()).toEqual({ response: 'ok' });
  });

  it('should check health check port at specic port successfully', async () => {
    process.env = {
      APP_PORT: '8080',
    };
    expect(healthController.check()).toEqual({ response: 'ok' });
  });
});
