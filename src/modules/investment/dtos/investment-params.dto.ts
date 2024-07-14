import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { InvestmentStatus } from '../enums/investments';
import { PaginationFilter } from 'src/shared/filter/pagination.filter';
import { IsOptional } from 'class-validator';

export class InvesmentParamsDTO extends PaginationFilter {
  @ApiProperty({
    type: InvestmentStatus,
    example: InvestmentStatus.ACTIVE,
    required: false,
  })
  @Expose()
  @IsOptional()
  status?: InvestmentStatus;
}
