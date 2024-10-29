import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { ListCategoriesDto } from './dto/request/list-categories.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(createCategoryDto as Category);

    expect(await service.create(createCategoryDto)).toEqual(createCategoryDto);
  });

  it('should find all categories', async () => {
    const listCategoriesDto: ListCategoriesDto = { offset: 0, limit: 10 };
    const categories: Category[] = [
      { id: 1, name: 'Test Category' } as Category,
    ];
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      distinct: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(categories),
      addOrderBy: jest.fn().mockReturnThis(),
    } as any);

    expect(await service.findAll(listCategoriesDto)).toEqual(categories);
  });

  it('should get category count', async () => {
    const listCategoriesDto: ListCategoriesDto = { offset: 0, limit: 10 };
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      getCount: jest.fn().mockResolvedValue(1),
      distinct: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
    } as any);

    expect(await service.getCount(listCategoriesDto)).toEqual(1);
  });

  it('should find one category', async () => {
    const category: Category = { id: 1, name: 'Test Category' } as Category;
    jest.spyOn(repository, 'findOne').mockResolvedValue(category);

    expect(await service.findOne(1)).toEqual(category);
  });

  it('should update a category', async () => {
    const updateCategoryDto: UpdateCategoryDto = {
      id: 1,
      name: 'Updated Category',
    };
    const category: Category = { id: 1, name: 'Test Category' } as Category;
    jest.spyOn(repository, 'findOne').mockResolvedValue(category);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue({ ...category, ...updateCategoryDto });

    expect(await service.update(1, updateCategoryDto)).toEqual({
      ...category,
      ...updateCategoryDto,
    });
  });

  it('should remove a category', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.remove(1)).toEqual({ affected: 1 });
  });
});
