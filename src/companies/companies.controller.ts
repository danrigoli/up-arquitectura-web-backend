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
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('companies')
@UseGuards(AuthGuard('jwt'))
@ApiTags('companies')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Company created',
    type: CompanyDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'List of companies',
    type: CompanyDto,
    isArray: true,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Count of companies',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Company found',
    type: CompanyDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Company updated',
    type: CompanyDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Company deleted',
  })
  async remove(@Param('id') id: string) {
    try {
      return await this.companiesService.remove(+id);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error deleting company');
    }
  }
}
