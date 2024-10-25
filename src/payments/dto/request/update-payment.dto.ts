import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from 'src/database/validators/exists.validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({
    description: 'ID of the payment',
    example: 1,
  })
  @Validate(Exists, ['Payment'])
  id: number;
}
