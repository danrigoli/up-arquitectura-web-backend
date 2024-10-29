import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { Exists } from 'src/database/validators/exists.validator';

export class CreatePaymentDto {
  @IsPositive()
  @IsNumber()
  @ApiProperty({
    description: 'Amount of the payment',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    description: 'Date of the payment',
    example: '2021-12-12',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Description of the payment',
    example: 'Payment for the service',
  })
  @IsString()
  @IsOptional()
  description: string;

  @Validate(Exists, ['Company'])
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Company ID of the payment',
    example: 1,
  })
  companyId: number;

  @Validate(Exists, ['Category'])
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Category ID of the payment',
    example: 1,
  })
  categoryId: number;
}
