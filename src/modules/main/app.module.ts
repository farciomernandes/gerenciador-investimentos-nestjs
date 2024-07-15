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
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // default TTL of 60 seconds
    }),
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
  providers: [],
})
export class AppModule {}
