import {
  Controller,
  Post,
  Body,
  Get,
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
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { ResponseInvestmentTransactionDto } from './dtos/response-transaction.dto';
import { ListTransactionDto } from './dtos/list-transaction.dto';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionTypes } from './enums/transaction';
import { TransactionInvestmentUseCase } from '@modules/investment/usecases/transaction-investment/transaction-investment.usecase';
import { ICreateTransactionUseCase } from './usecases/create-transaction/interface/create-transaction.interface';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: ICreateTransactionUseCase,
    private readonly transactionInvestmentUseCase: TransactionInvestmentUseCase,
  ) {}

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
    type: TransactionDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ResponseInvestmentTransactionDto> {
    const type = TransactionTypes[createTransactionDto.type];
    return this.transactionInvestmentUseCase.execute(
      createTransactionDto.investment_id,
      createTransactionDto,
      type,
    );
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
    return this.createTransactionUseCase.getTransactions(queryParams);
  }
}
