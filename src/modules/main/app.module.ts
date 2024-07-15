import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import { MainModule } from '@modules/main/main.module';
import { UserModule } from '@modules/user/user.module';
import { InvestmentModule } from '@modules/investment/investment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '@infra/typeorm/datasource.config';
import { AuthModule } from '@modules/auth/auth.module';
import { TransactionModule } from '@modules/transaction/transaction.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // default,
      max: 100, // número máximo de itens em cache
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //miliseconds
        limit: 10, // requests
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        await dataSource.initialize();
        return dataSource;
      },
    }),
    HealthModule,
    MainModule,
    AuthModule,
    UserModule,
    InvestmentModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
