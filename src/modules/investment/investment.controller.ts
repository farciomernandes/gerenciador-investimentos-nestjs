import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  HttpCode,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  CreatedInvestment,
  CreateInvestmentDto,
} from './dtos/create-investment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInvestmentDto } from './dtos/response-investment.dto';
import { InvesmentParamsDTO } from './dtos/investment-params.dto';
import { Investment } from './entities/investment.entity';
import {
  TransactionInvestmentDto,
  UpdateInvestmentDto,
} from './dtos/update-investment.dto';
import { ICreateInvestmentUseCase } from './usecases/create-investment/interfaces/create-investment.interface';
import { IGetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/interfaces/get-investments-by-owner-id.interface';
import { IGetInvestmentsUseCase } from './usecases/get-investments/interfaces/get-investments.interface';
import { ITransactionInvestmentUseCase } from './usecases/transaction-investment/interfaces/transaction-investment.interface';
import { IUpdateInvestmentUseCase } from './usecases/update-investment/interfaces/update-investment.interface';
import { IDeleteInvestmentUseCase } from './usecases/delete-investment/interfaces/delete-investment.interface';
import { Request as expressRequest } from 'express';
import { ResponseInvestmentTransactionDto } from '@modules/transaction/dtos/response-transaction.dto';
import { IGetInvestmentDetailsUseCase } from './usecases/get-investment-details/interface/get-investment-details.interface';
import { ResponseInvestmentDetails } from './dtos/response-investment-details.dto';

@ApiTags('Investments')
@Controller('investments')
export class InvestmentController {
  constructor(
    private readonly createInvestmentUseCase: ICreateInvestmentUseCase,
    private readonly getInvestmentsByOwnerIdUseCase: IGetInvestmentsByOwnerIdUseCase,
    private readonly getInvestmentsUseCase: IGetInvestmentsUseCase,
    private readonly updateInvestmentUseCase: IUpdateInvestmentUseCase,
    private readonly transactionInvestmentUseCase: ITransactionInvestmentUseCase,
    private readonly deleteInvestmentUseCase: IDeleteInvestmentUseCase,
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
    type: CreatedInvestment,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async create(
    @Request() req: expressRequest,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ): Promise<Investment> {
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

  @Patch(':id')
  @ApiBody({
    type: UpdateInvestmentDto,
    description: 'The value update investment',
  })
  @ApiOkResponse({
    description: 'Updated Investment',
    type: CreatedInvestment,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<Investment> {
    return this.updateInvestmentUseCase.execute(updateInvestmentDto, id);
  }

  @Patch(':id/transaction')
  @ApiBody({
    type: TransactionInvestmentDto,
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
    return this.transactionInvestmentUseCase.execute(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete investment by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteInvestmentUseCase.execute(id);
  }
}
