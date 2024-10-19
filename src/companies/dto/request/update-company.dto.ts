import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsNumber, Validate } from 'class-validator';
import { Exists } from 'src/database/validators/exists.validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsNumber()
  @Validate(Exists, ['Company'])
  id: number;
}
