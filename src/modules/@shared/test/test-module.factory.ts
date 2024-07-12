import { dataSource } from '@infra/typeorm/datasource.config';
import { Setups } from '@modules/main/setups';
import {
  type INestApplication,
  type ModuleMetadata,
  type Provider,
  type ValueProvider,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TestModuleFactory {
  static async makeModule(
    moduleMetadata: ModuleMetadata,
    overriders?: Provider[],
  ): Promise<INestApplication> {
    const module = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
        TypeOrmModule.forRootAsync({
          dataSourceFactory: async () => {
            await dataSource.initialize();
            return dataSource;
          },
          useFactory: () => ({}),
        }),
        ...(moduleMetadata.imports?.length ? moduleMetadata.imports : []),
      ],
      controllers: moduleMetadata.controllers,
      providers: moduleMetadata.providers,
      exports: moduleMetadata.exports,
    });

    if (overriders?.length)
      for (const overrider of overriders) {
        const overriderProvider = overrider as ValueProvider;
        module
          .overrideProvider(overriderProvider.provide)
          .useValue(overriderProvider.useValue);
      }

    const app = (await module.compile()).createNestApplication();

    const ds = app.get(DataSource);
    await ds.dropDatabase();
    await ds.runMigrations();

    Setups.setApp(app).middlewares();
    await app.init();

    return app;
  }

  static async dropModule(app: INestApplication): Promise<void> {
    await app.close();
  }
}
