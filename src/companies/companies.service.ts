import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}
  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companiesRepository.save(createCompanyDto);
  }

  findAll() {
    return this.companiesRepository.find();
  }

  findOne(id: number) {
    return this.companiesRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });
    return this.companiesRepository.save({ ...company, ...updateCompanyDto });
  }

  remove(id: number) {
    return this.companiesRepository.softDelete(id);
  }
}
