import { WithdrawalRepository } from '@infra/typeorm/repositories/withdrawal.respository';
import { Module } from '@nestjs/common';
import { WithdrawalProvider } from './providers/wihdrawal.provider';
import { WithdrawalController } from './withdrawal.controller';

@Module({
  imports: [],
  providers: [WithdrawalRepository, WithdrawalProvider],
  controllers: [WithdrawalController],
})
export class WithdrawalModule {}
