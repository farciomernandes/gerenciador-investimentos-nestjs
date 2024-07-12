import { Module } from '@nestjs/common';
import { MainController } from '@modules/main/main.controller';

@Module({
  controllers: [MainController],
})
export class MainModule {}
