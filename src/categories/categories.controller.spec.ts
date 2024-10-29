import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { ListCategoriesDto } from './dto/request/list-categories.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryDto } from './dto/response/category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
      const result = createCategory(createCategoryDto);
      jest.spyOn(service, 'create').mockImplementation(async () => result);

      expect(await controller.create(createCategoryDto)).toEqual(
        new CategoryDto(result),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result: Category[] = [createCategory({ id: 1 })];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll(new ListCategoriesDto())).toEqual(
        result.map((category) => new CategoryDto(category)),
      );
    });
  });

  describe('getCount', () => {
    it('should return the count of categories', async () => {
      const result = 5;
      jest.spyOn(service, 'getCount').mockImplementation(async () => result);

      expect(await controller.getCount(new ListCategoriesDto())).toEqual({
        count: result,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const result: Category = createCategory({ id: 1 });
      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne('1')).toEqual(new CategoryDto(result));
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        id: 1,
        name: 'Updated Category',
      };
      const result: Category = createCategory(updateCategoryDto);
      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update('1', updateCategoryDto)).toEqual(
        new CategoryDto(result),
      );
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const result = { raw: {}, affected: 1 };
      jest.spyOn(service, 'remove').mockImplementation(async () => result);

      expect(await controller.remove('1')).toEqual(result);
    });
  });
});

const createCategory = (overrides?: Partial<Category>): Category => {
  return {
    id: Math.floor(Math.random() * 1000),
    name: 'Default Category Name',
    createdAt: new Date(),
    updatedAt: new Date(),
    payments: [],
    ...overrides,
  };
};
