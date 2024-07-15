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

@ApiTags('Investments')
@Controller('investments')
@UseInterceptors(CacheInterceptor)
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
    summary: 'Create an investment',
  })
  @ApiBody({
    type: CreateInvestmentDto,
    description:
      'Payload to create an investment or update amount if name investment already exists!',
  })
  @ApiOkResponse({
    description: 'Created Investment',
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
    summary: 'Get all investments by owner id',
  })
  @ApiOkResponse({
    description: 'Return all investments by owner id',
    type: ResponseInvestmentDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAllByOwnerId(
    @Param('owner_id') owner_id: string,
    @Query() filter: InvesmentParamsDTO,
  ): Promise<any> {
    return this.getInvestmentsByOwnerIdUseCase.execute(owner_id, filter);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all investments',
  })
  @ApiOkResponse({
    description: 'Return all investments',
    type: ResponseInvestmentDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
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
    summary: 'Get details to investment',
  })
  @ApiOkResponse({
    description: 'Return details to investment',
    type: ResponseInvestmentDetails,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getInvestmentDetails(@Param('id') investment_id: string) {
    return this.getInvestmentDetailsUseCase.execute(investment_id);
  }

  @Patch(':id/withdrawal')
  @ApiBody({
    type: TransactionInvestmentDto,
    description: 'Retirar valor de um investimento',
  })
  @ApiOkResponse({
    description: 'Transaction successful',
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
