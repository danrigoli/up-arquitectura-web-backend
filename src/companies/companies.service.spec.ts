import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { ListCompaniesDto } from './dto/request/list-companies.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repository: Repository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a company', async () => {
    const createCompanyDto: CreateCompanyDto = {
      name: 'Test Company',
      address: 'Local 123',
    };
    const company = { id: 1, ...createCompanyDto };
    jest.spyOn(repository, 'save').mockResolvedValue(company as Company);

    expect(await service.create(createCompanyDto)).toEqual(company);
  });

  it('should find all companies', async () => {
    const listCompaniesDto: ListCompaniesDto = { offset: 0, limit: 10 };
    const companies = [{ id: 1, name: 'Test Company' }];
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(companies),
    } as any);

    expect(await service.findAll(listCompaniesDto)).toEqual(companies);
  });

  it('should get count of companies', async () => {
    const listCompaniesDto: ListCompaniesDto = {};
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      getCount: jest.fn().mockResolvedValue(1),
      addOrderBy: jest.fn().mockReturnThis(), // Mock addOrderBy to avoid TypeError
    } as any);

    expect(await service.getCount(listCompaniesDto)).toEqual(1);
  });

  it('should find one company by id', async () => {
    const company = { id: 1, name: 'Test Company' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(company as Company);

    expect(await service.findOne(1)).toEqual(company);
  });

  it('should update a company', async () => {
    const updateCompanyDto: UpdateCompanyDto = {
      id: 1,
      name: 'Updated Company',
    };
    const company = { id: 1, name: 'Test Company' };
    const updatedCompany = { ...company, ...updateCompanyDto };
    jest.spyOn(repository, 'findOne').mockResolvedValue(company as Company);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedCompany as Company);

    expect(await service.update(1, updateCompanyDto)).toEqual(updatedCompany);
  });

  it('should remove a company', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.remove(1)).toEqual({ affected: 1 });
  });
});
