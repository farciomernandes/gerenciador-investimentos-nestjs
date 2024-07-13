import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationFilter {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({
    type: Number,
    description: 'The page number',
    example: '1',
  })
  page = 1;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    description: 'Limit number of records to return in pagination',
    example: '10',
  })
  limit = 10;
}
