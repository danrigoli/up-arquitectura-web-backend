import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListCompaniesDto } from './dto/request/list-companies.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}
  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyRepository.save(createCompanyDto);
  }

  findAll(listCategoriesDto: ListCompaniesDto) {
    const companiesQuery = this.getCompaniesQuery(listCategoriesDto);
    companiesQuery.offset(listCategoriesDto.offset);
    companiesQuery.limit(listCategoriesDto.limit);
    return companiesQuery.getMany();
  }

  async getCount(listCategoriesDto: ListCompaniesDto) {
    const companiesQuery = this.getCompaniesQuery(listCategoriesDto);
    return companiesQuery.getCount();
  }

  findOne(id: number) {
    return this.companyRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });
    return this.companyRepository.save({ ...company, ...updateCompanyDto });
  }

  remove(id: number) {
    return this.companyRepository.delete(id);
  }

  getCompaniesQuery(query: ListCompaniesDto) {
    const companiesQuery = this.companyRepository.createQueryBuilder('company');
    if (query.search) {
      companiesQuery.where('company.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.sort) {
      companiesQuery.addOrderBy('company.' + query.sort, query.order || 'ASC');
    } else {
      companiesQuery.addOrderBy('company.createdAt', 'DESC');
    }

    return companiesQuery;
  }
}
