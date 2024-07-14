import { Injectable } from '@nestjs/common';
import { Withdrawal } from '../entities/withdrawal.entity';
import { WithdrawalRepository } from '@infra/typeorm/repositories/withdrawal.respository';
import { CreateWithdrawalDto } from '../dtos/create-withdrawal.dto';
import {
  ListWithdrawalDto,
  WithdrawalResponse,
} from '../dtos/list-withdrawal.dto';
import { PaginationFilter } from 'src/shared/filter/pagination.filter';

@Injectable()
export class WithdrawalProvider {
  constructor(private readonly withdrawalRepository: WithdrawalRepository) {}

  async createWithdrawal(payload: CreateWithdrawalDto): Promise<Withdrawal> {
    const withdrawal = this.withdrawalRepository.create(payload);
    return await this.withdrawalRepository.save(withdrawal);
  }

  async getWithdrawals(
    queryParams: PaginationFilter,
  ): Promise<ListWithdrawalDto> {
    const { page, limit } = queryParams;
    const offset = (page - 1) * limit;

    const [withdrawals, count] = await this.withdrawalRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const totalPages = Math.ceil(count / limit);

    const withdrawalsFormated: WithdrawalResponse[] = withdrawals.map(
      (withdrawal) => {
        const withdrawalResponse: WithdrawalResponse = {
          id: withdrawal.id,
          investment_id: withdrawal.investment_id,
          withdrawal_date: withdrawal.withdrawal_date,
          amount: Number(withdrawal.amount),
          tax: Number(withdrawal.tax),
          net_amount: Number(withdrawal.net_amount),
        };
        return withdrawalResponse;
      },
    );

    return {
      withdrawals: withdrawalsFormated,
      totalPages,
    };
  }

  async getWithdrawal(id: string): Promise<Withdrawal> {
    return this.withdrawalRepository.findOneOrFail({ where: { id } });
  }

  async deleteWithdrawal(id: string): Promise<void> {
    await this.withdrawalRepository.delete(id);
  }
}
