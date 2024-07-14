import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { CreateInvestmentUseCase } from './usecases/create-investment/create-investment.usecase';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInvestmentDto } from './dtos/response-investment.dto';
import { InvesmentParamsDTO } from './dtos/investment-params.dto';
import { Investment } from './entities/investment.entity';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';
import { GetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/get-investments-by-owner-id.usecase';
import { GetInvestmentsUseCase } from './usecases/get-investments/get-investments.usecase';
import { GetInvestmentUseCase } from './usecases/get-investment/get-investment.usecase';
import { UpdateInvestmentUseCase } from './usecases/update-investment/update-investment.usecase';
import { WithdrawInvestmentUseCase } from './usecases/withdraw-investment/withdraw-investment.usecase';

@ApiTags('api/v1/investments')
@Controller('investments')
export class InvestmentController {
  constructor(
    private readonly createInvestmentUseCase: CreateInvestmentUseCase,
    private readonly getInvestmentsByOwnerIdUseCase: GetInvestmentsByOwnerIdUseCase,
    private readonly getInvestmentsUseCase: GetInvestmentsUseCase,
    private readonly getInvestmentUseCase: GetInvestmentUseCase,
    private readonly updateInvestmentUseCase: UpdateInvestmentUseCase,
    private readonly withdrawInvestmentUseCase: WithdrawInvestmentUseCase,
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
    type: Investment,
  })
  async create(
    @Body() createInvestmentDto: CreateInvestmentDto,
  ): Promise<Investment> {
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

  @Patch(':id')
  @ApiBody({
    type: UpdateInvestmentDto,
    description: 'The value update investment',
  })
  @ApiOkResponse({
    description: 'Updated Investment',
    type: Investment,
  })
  async update(
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<Investment> {
    return this.updateInvestmentUseCase.execute(updateInvestmentDto, id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an investment by id',
  })
  @ApiOkResponse({
    description: 'Return an investment by id',
    type: Investment,
  })
  async findOne(@Param('id') id: string): Promise<Investment | null> {
    return this.getInvestmentUseCase.execute(id);
  }

  @Patch(':id/withdraw')
  @ApiOkResponse({
    description: 'Withdrawal successful',
    type: Withdrawal,
  })
  async withdraw(@Param('id') id: string): Promise<Withdrawal> {
    return this.withdrawInvestmentUseCase.execute(id);
  }
}
