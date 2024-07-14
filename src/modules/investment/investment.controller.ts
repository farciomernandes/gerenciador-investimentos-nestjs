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
  HttpStatus,
} from '@nestjs/common';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInvestmentDto } from './dtos/response-investment.dto';
import { InvesmentParamsDTO } from './dtos/investment-params.dto';
import { Investment } from './entities/investment.entity';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';
import { ICreateInvestmentUseCase } from './usecases/create-investment/interfaces/create-investment.interface';
import { IGetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/interfaces/get-investments-by-owner-id.interface';
import { IGetInvestmentsUseCase } from './usecases/get-investments/interfaces/get-investments.interface';
import { IGetInvestmentUseCase } from './usecases/get-investment/interfaces/get-investment.interface';
import { IWithdrawInvestmentUseCase } from './usecases/withdraw-investment/interfaces/withdraw-investment.interface';
import { IUpdateInvestmentUseCase } from './usecases/update-investment/interfaces/update-investment.interface';
import { IDeleteInvestmentUseCase } from './usecases/delete-investment/interfaces/delete-investment.interface';
import { Public } from '@modules/auth/decorator/public';

@ApiTags('Investments')
@Controller('investments')
export class InvestmentController {
  constructor(
    private readonly createInvestmentUseCase: ICreateInvestmentUseCase,
    private readonly getInvestmentsByOwnerIdUseCase: IGetInvestmentsByOwnerIdUseCase,
    private readonly getInvestmentsUseCase: IGetInvestmentsUseCase,
    private readonly getInvestmentUseCase: IGetInvestmentUseCase,
    private readonly updateInvestmentUseCase: IUpdateInvestmentUseCase,
    private readonly withdrawInvestmentUseCase: IWithdrawInvestmentUseCase,
    private readonly deleteInvestmentUseCase: IDeleteInvestmentUseCase,
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
  @HttpCode(HttpStatus.OK)
  @Public()
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
  @Public()
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
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<Investment> {
    return this.updateInvestmentUseCase.execute(updateInvestmentDto, id);
  }

  @Patch(':id/withdraw')
  @ApiOkResponse({
    description: 'Withdrawal successful',
    type: Withdrawal,
  })
  @HttpCode(HttpStatus.OK)
  async withdraw(@Param('id') id: string): Promise<Withdrawal> {
    return this.withdrawInvestmentUseCase.execute(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete investment by id',
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteInvestmentUseCase.execute(id);
  }
}
