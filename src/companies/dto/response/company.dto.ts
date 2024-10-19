import { Company } from 'src/companies/entities/company.entity';

export class CompanyDto {
  id?: number;
  name?: string;
  address?: string;

  constructor(company: Company) {
    this.id = company.id;
    this.name = company.name;
    this.address = company.address;
  }
}
