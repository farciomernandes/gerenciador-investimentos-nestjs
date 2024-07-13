import { Controller, Post, Body, Get } from '@nestjs/common';
import { InvestmentProvider } from './providers/investment.provider';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { CreateInvestmentUseCase } from './usecases/create-investment.usecase';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('api/v1/investments')
@Controller('investments')
export class InvestmentController {
  constructor(
    private readonly investmentProvider: InvestmentProvider,
    private readonly createInvestmentUseCase: CreateInvestmentUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Investment',
  })
  @ApiBody({
    type: CreateInvestmentDto,
    description: 'Payload to create Investment',
  })
  @ApiOkResponse({
    description: 'Created Investment',
    type: CreateInvestmentDto,
  })
  async create(@Body() createInvestmentDto: CreateInvestmentDto): Promise<any> {
    return this.createInvestmentUseCase.execute(createInvestmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all Investments',
  })
  @ApiOkResponse({
    description: 'Return all Investments',
    type: CreateInvestmentDto,
    isArray: true,
  })
  async findAll(): Promise<any> {
    return this.investmentProvider.findAll();
  }
}
