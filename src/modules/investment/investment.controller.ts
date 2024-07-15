import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  HttpCode,
  Request,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInvestmentDto } from './dtos/response-investment.dto';
import { InvesmentParamsDTO } from './dtos/investment-params.dto';
import { TransactionInvestmentDto } from './dtos/update-investment.dto';
import { ICreateInvestmentUseCase } from './usecases/create-investment/interfaces/create-investment.interface';
import { IGetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/interfaces/get-investments-by-owner-id.interface';
import { IGetInvestmentsUseCase } from './usecases/get-investments/interfaces/get-investments.interface';
import { ITransactionInvestmentUseCase } from './usecases/transaction-investment/interfaces/transaction-investment.interface';
import { Request as expressRequest } from 'express';
import { ResponseInvestmentTransactionDto } from '@modules/transaction/dtos/response-transaction.dto';
import { IGetInvestmentDetailsUseCase } from './usecases/get-investment-details/interface/get-investment-details.interface';
import { ResponseInvestmentDetails } from './dtos/response-investment-details.dto';
import { TransactionTypes } from '@modules/transaction/enums/transaction';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Investments')
@Controller('investments')
@UseInterceptors(CacheInterceptor)
@UseGuards(ThrottlerGuard)
export class InvestmentController {
  constructor(
    private readonly createInvestmentUseCase: ICreateInvestmentUseCase,
    private readonly getInvestmentsByOwnerIdUseCase: IGetInvestmentsByOwnerIdUseCase,
    private readonly getInvestmentsUseCase: IGetInvestmentsUseCase,
    private readonly transactionInvestmentUseCase: ITransactionInvestmentUseCase,
    private readonly getInvestmentDetailsUseCase: IGetInvestmentDetailsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um investimento',
  })
  @ApiBody({
    type: CreateInvestmentDto,
    description:
      'Payload para criar um investimento ou atualizar o valor se o investimento já existir.',
  })
  @ApiOkResponse({
    description: 'Investimento criado',
    type: ResponseInvestmentDetails,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async create(
    @Request() req: expressRequest,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ): Promise<ResponseInvestmentDetails> {
    createInvestmentDto.owner_id = req?.user.id;
    return this.createInvestmentUseCase.execute(createInvestmentDto);
  }

  @Get('owner/:owner_id')
  @ApiOperation({
    summary: 'Obter todos os investimentos por ID do proprietário',
  })
  @ApiOkResponse({
    description: 'Retorna todos os investimentos por ID do proprietário',
    type: ResponseInvestmentDto,
  })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async findAllByOwnerId(
    @Param('owner_id') owner_id: string,
    @Query() filter: InvesmentParamsDTO,
  ): Promise<any> {
    return this.getInvestmentsByOwnerIdUseCase.execute(owner_id, filter);
  }

  @Get()
  @ApiOperation({
    summary: 'Obter todos os investimentos',
  })
  @ApiOkResponse({
    description: 'Retorna todos os investimentos',
    type: ResponseInvestmentDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async findAll(
    @Query() filter: InvesmentParamsDTO,
  ): Promise<ResponseInvestmentDto> {
    if (filter.status) {
      return this.getInvestmentsUseCase.execute(
        filter.page,
        filter.limit,
        filter.status,
      );
    } else {
      return this.getInvestmentsUseCase.execute(filter.page, filter.limit);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes do investimento',
  })
  @ApiOkResponse({
    description: 'Retorna detalhes do investimento',
    type: ResponseInvestmentDetails,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async getInvestmentDetails(@Param('id') investment_id: string) {
    return this.getInvestmentDetailsUseCase.execute(investment_id);
  }

  @Patch(':id/withdrawal')
  @ApiBody({
    type: TransactionInvestmentDto,
    description: 'Retirar valor de um investimento',
  })
  @ApiOkResponse({
    description: 'Transação realizada com sucesso',
    type: ResponseInvestmentTransactionDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async transaction(
    @Param('id') id: string,
    @Body() payload: TransactionInvestmentDto,
  ): Promise<any> {
    return this.transactionInvestmentUseCase.execute(
      id,
      payload,
      TransactionTypes.OUTPUT,
    );
  }
}
