import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Withdrawal } from './entities/withdrawal.entity';
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { ListWithdrawalDto } from './dtos/list-withdrawal.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WithdrawalProvider } from './providers/wihdrawal.provider';
import { PaginationFilter } from 'src/shared/filter/pagination.filter';

@ApiTags('api/v1/withdrawals')
@Controller('withdrawals')
export class WithdrawalController {
  constructor(private readonly withdrawalProvider: WithdrawalProvider) {}

  @Post()
  @ApiOperation({
    summary: 'Create a withdrawal',
  })
  @ApiBody({
    type: CreateWithdrawalDto,
    description: 'Payload to create a withdrawal',
  })
  @ApiOkResponse({
    description: 'Created Withdrawal',
    type: Withdrawal,
  })
  async createWithdrawal(
    @Body() createWithdrawalDto: CreateWithdrawalDto,
  ): Promise<Withdrawal> {
    return this.withdrawalProvider.createWithdrawal(createWithdrawalDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all withdrawals',
  })
  @ApiOkResponse({
    description: 'Return all withdrawals',
    type: ListWithdrawalDto,
  })
  async getWithdrawals(
    @Query() queryParams: PaginationFilter,
  ): Promise<ListWithdrawalDto> {
    return this.withdrawalProvider.getWithdrawals(queryParams);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a withdrawal by ID',
  })
  @ApiOkResponse({
    description: 'Return a withdrawal by ID',
    type: Withdrawal,
  })
  async getWithdrawal(@Param('id') id: string): Promise<Withdrawal> {
    return this.withdrawalProvider.getWithdrawal(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a withdrawal',
  })
  @ApiOkResponse({
    description: 'Withdrawal deleted successfully',
  })
  async deleteWithdrawal(@Param('id') id: string): Promise<void> {
    await this.withdrawalProvider.deleteWithdrawal(id);
  }
}
