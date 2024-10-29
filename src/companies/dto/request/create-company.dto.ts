import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Company name' })
  name: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Company address' })
  address: string;
}
