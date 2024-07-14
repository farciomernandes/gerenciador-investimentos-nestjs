import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { InvestmentProvider } from './providers/investment.provider';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { CreateInvestmentUseCase } from './usecases/create-investment.usecase';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInvestmentDto } from './dtos/response-investment.dto';
import { InvesmentParamsDTO } from './dtos/investment-params.dto';
import { Investment } from './entities/investment.entity';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';

@ApiTags('api/v1/investments')
@Controller('investments')
export class InvestmentController {
  constructor(
    private readonly investmentProvider: InvestmentProvider,
    private readonly createInvestmentUseCase: CreateInvestmentUseCase,
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
    return this.investmentProvider.findAllByOwnerId(owner_id, filter);
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
      return this.investmentProvider.findAllWithStatus(
        filter.page,
        filter.limit,
        filter.status,
      );
    } else {
      return this.investmentProvider.findAll(filter.page, filter.limit);
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
    return this.investmentProvider.update(updateInvestmentDto, id);
  }

  @Patch(':id/withdraw')
  @ApiOkResponse({
    description: 'Withdrawal successful',
    type: Withdrawal,
  })
  async withdraw(@Param('id') id: string): Promise<Withdrawal> {
    return this.investmentProvider.withdraw(id);
  }
}
