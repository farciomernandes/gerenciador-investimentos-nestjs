import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import { MainModule } from '@modules/main/main.module';
import { UserModule } from '@modules/user/user.module';
import { InvestmentModule } from '@modules/investment/investment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '@infra/typeorm/datasource.config';
import { WithdrawalModule } from '@modules/withdrawal/withdrawal.module';

@Module({
  imports: [
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
    UserModule,
    InvestmentModule,
    WithdrawalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
