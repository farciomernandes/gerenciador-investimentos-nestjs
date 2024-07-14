import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Withdrawal } from './entities/withdrawal.entity';
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { ListWithdrawalDto } from './dtos/list-withdrawal.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WithdrawalProvider } from './providers/wihdrawal.provider';
import { PaginationFilter } from 'src/shared/filter/pagination.filter';
import { ResponseInvesvmentWithdrawDto } from './dtos/response-withdraw.dto';

@ApiTags('Withdrawals')
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
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createWithdrawal(
    @Body() createWithdrawalDto: CreateWithdrawalDto,
  ): Promise<ResponseInvesvmentWithdrawDto> {
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
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getWithdrawals(
    @Query() queryParams: PaginationFilter,
  ): Promise<ListWithdrawalDto> {
    return this.withdrawalProvider.getWithdrawals(queryParams);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a withdrawal',
  })
  @ApiOkResponse({
    description: 'Withdrawal deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async deleteWithdrawal(@Param('id') id: string): Promise<void> {
    await this.withdrawalProvider.deleteWithdrawal(id);
  }
}
