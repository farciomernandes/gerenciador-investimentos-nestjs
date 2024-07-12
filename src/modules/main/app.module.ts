import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import { MainModule } from '@modules/main/main.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HealthModule, MainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
