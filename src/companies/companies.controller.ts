import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { CompanyDto } from './dto/response/company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companiesService.create(createCompanyDto);
    return new CompanyDto(company);
  }

  @Get()
  async findAll() {
    const companies = await this.companiesService.findAll();
    return companies.map((company) => new CompanyDto(company));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findOne(+id);
    return new CompanyDto(company);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return new CompanyDto(
      await this.companiesService.update(+id, updateCompanyDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.companiesService.remove(+id);
    return { deleted: result.affected };
  }
}
