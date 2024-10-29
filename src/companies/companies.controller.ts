import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { CompanyDto } from './dto/response/company.dto';
import { ListCompaniesDto } from './dto/request/list-companies.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('companies')
@UseGuards(AuthGuard('jwt'))
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.companiesService.create(createCompanyDto);
      return new CompanyDto(company);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error creating company');
    }
  }

  @Get()
  async findAll(@Query() listCompaniesDto: ListCompaniesDto) {
    try {
      const companies = await this.companiesService.findAll(listCompaniesDto);
      return companies.map((company) => new CompanyDto(company));
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error fetching companies');
    }
  }

  @Get('count')
  async getCount(@Query() listCompaniesDto: ListCompaniesDto) {
    try {
      return { count: await this.companiesService.getCount(listCompaniesDto) };
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(
        error.message,
        'Error fetching companies count',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const company = await this.companiesService.findOne(+id);
      return new CompanyDto(company);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error fetching company');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const company = await this.companiesService.update(+id, updateCompanyDto);
      return new CompanyDto(company);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error updating company');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.companiesService.remove(+id);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error deleting company');
    }
  }
}
