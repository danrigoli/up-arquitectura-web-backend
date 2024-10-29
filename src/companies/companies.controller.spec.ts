import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { ListCompaniesDto } from './dto/request/list-companies.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        address: 'Test Address',
      };
      const result = createCompany({ ...createCompanyDto });
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCompanyDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const result = [createCompany()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(new ListCompaniesDto())).toEqual(result);
    });
  });

  describe('getCount', () => {
    it('should return the count of companies', async () => {
      const result = { count: 1 };
      jest.spyOn(service, 'getCount').mockResolvedValue(result.count);

      expect(await controller.getCount(new ListCompaniesDto())).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single company', async () => {
      const result = createCompany();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        id: 1,
        name: 'Updated Company',
        address: 'Updated Address',
      };
      const result = createCompany(updateCompanyDto);
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateCompanyDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const result = { raw: {}, affected: 1 };
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
    });
  });
});

const createCompany = (overrides?: Partial<Company>): Company => {
  return {
    id: Math.floor(Math.random() * 1000),
    name: 'Default Company Name',
    address: 'Default Company Address',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
