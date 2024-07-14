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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationFilter } from 'src/shared/filter/pagination.filter';
import { TransactionProvider } from './providers/transaction.provider';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from 'typeorm';
import { ResponseInvestmentTransactionDto } from './dtos/response-transaction.dto';
import { ListTransactionDto } from './dtos/list-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly TransactionProvider: TransactionProvider) {}

  @Post()
  @ApiOperation({
    summary: 'Create a Transaction',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Payload to create a Transaction',
  })
  @ApiOkResponse({
    description: 'Created Transaction',
    type: Transaction,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ResponseInvestmentTransactionDto> {
    return this.TransactionProvider.createTransaction(createTransactionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all Transactions',
  })
  @ApiOkResponse({
    description: 'Return all Transactions',
    type: ListTransactionDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getTransactions(
    @Query() queryParams: PaginationFilter,
  ): Promise<ListTransactionDto> {
    return this.TransactionProvider.getTransactions(queryParams);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a Transaction',
  })
  @ApiOkResponse({
    description: 'Transaction deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async deleteTransaction(@Param('id') id: string): Promise<void> {
    await this.TransactionProvider.deleteTransaction(id);
  }
}
