import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
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
import { ICreateTransactionUseCase } from './usecases/create-transaction/interface/create-transaction.interface';
import { ITransactionInvestmentUseCase } from '@modules/investment/usecases/transaction-investment/interfaces/transaction-investment.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Transactions')
@Controller('transactions')
@UseInterceptors(CacheInterceptor)
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: ICreateTransactionUseCase,
    private readonly transactionInvestmentUseCase: ITransactionInvestmentUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma Transação',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Payload para criar uma Transação',
  })
  @ApiOkResponse({
    description: 'Transação criada com sucesso',
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
    summary: 'Obter todas as Transações',
  })
  @ApiOkResponse({
    description: 'Retorna todas as Transações',
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
