import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/companies/entities/company.entity';

export class CompanyDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Company name' })
  name: string;

  @ApiProperty({ example: 'Company address' })
  address: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(company: Company) {
    this.id = company.id;
    this.name = company.name;
    this.address = company.address;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
  }
}
