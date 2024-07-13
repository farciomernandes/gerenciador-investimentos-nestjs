import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InvestmentProvider } from './providers/investment.provider';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { CreateInvestmentUseCase } from './usecases/create-investment.usecase';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInvestmentDto } from './dto/response-investment.dto';

@ApiTags('api/v1/investments')
@Controller('investments')
export class InvestmentController {
  constructor(
    private readonly investmentProvider: InvestmentProvider,
    private readonly createInvestmentUseCase: CreateInvestmentUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create first investment',
  })
  @ApiBody({
    type: CreateInvestmentDto,
    description:
      'Payload to create investment, initial value is not null and not negative',
  })
  @ApiOkResponse({
    description: 'Created Investment',
    type: CreateInvestmentDto,
  })
  async create(@Body() createInvestmentDto: CreateInvestmentDto): Promise<any> {
    return this.createInvestmentUseCase.execute(createInvestmentDto);
  }

  @Get('owner/:owner_id')
  @ApiOperation({
    summary: 'Get all Investments by owner id',
  })
  @ApiOkResponse({
    description: 'Return all Investments by owner id',
    isArray: true,
    type: ResponseInvestmentDto,
  })
  async findAllByOwnerId(
    @Param('owner_id') owner_id: string,
  ): Promise<ResponseInvestmentDto[]> {
    return this.investmentProvider.findAllByOwnerId(owner_id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all Investments',
  })
  @ApiOkResponse({
    description: 'Return all Investments',
    isArray: true,
    type: ResponseInvestmentDto,
  })
  async findAll(): Promise<ResponseInvestmentDto[]> {
    return this.investmentProvider.findAll();
  }
}
