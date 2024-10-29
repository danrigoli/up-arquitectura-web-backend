import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ListCategoriesDto } from './dto/request/list-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  async findAll(listCategoriesDto: ListCategoriesDto) {
    const categoriesQuery = this.getCategoriesQuery(listCategoriesDto);
    categoriesQuery.offset(listCategoriesDto.offset);
    categoriesQuery.limit(listCategoriesDto.limit);
    return await categoriesQuery.getMany();
  }

  async getCount(listCategoriesDto: ListCategoriesDto) {
    const categoriesQuery = this.getCategoriesQuery(listCategoriesDto);
    return categoriesQuery.getCount();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return this.categoryRepository.save({ ...category, ...updateCategoryDto });
  }

  async remove(id: number) {
    const deleteResult = await this.categoryRepository.delete(id);
    return deleteResult;
  }

  getCategoriesQuery(query: ListCategoriesDto) {
    const categoriesQuery =
      this.categoryRepository.createQueryBuilder('category');
    categoriesQuery.distinct(true);
    if (query.search) {
      categoriesQuery.where('category.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.sort) {
      categoriesQuery.addOrderBy(
        'category.' + query.sort,
        query.order || 'ASC',
      );
    } else {
      categoriesQuery.addOrderBy('category.createdAt', 'DESC');
    }

    return categoriesQuery;
  }
}
