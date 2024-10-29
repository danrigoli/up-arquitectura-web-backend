import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ListPaymentsDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  search?: string;

  @ApiProperty()
  @IsOptional()
  limit? = 30;

  @ApiProperty()
  @IsOptional()
  offset? = 0;

  @ApiProperty()
  @IsOptional()
  sort?: string;

  @ApiProperty()
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'DESC';
}
