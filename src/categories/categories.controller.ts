import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { CategoryDto } from './dto/response/category.dto';
import { ListCategoriesDto } from './dto/request/list-categories.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const created = await this.categoriesService.create(createCategoryDto);
      return new CategoryDto(created);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error creating category');
    }
  }

  @Get()
  async findAll(@Query() listCategoriesDto: ListCategoriesDto) {
    try {
      const categories =
        await this.categoriesService.findAll(listCategoriesDto);
      return categories.map((category) => new CategoryDto(category));
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error fetching categories');
    }
  }

  @Get('count')
  async getCount(@Query() listCategoriesDto: ListCategoriesDto) {
    return { count: await this.categoriesService.getCount(listCategoriesDto) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoriesService.findOne(+id);
      return new CategoryDto(category);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error fetching category');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const updated = await this.categoriesService.update(
        +id,
        updateCategoryDto,
      );
      return new CategoryDto(updated);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error updating category');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.categoriesService.remove(+id);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error deleting category');
    }
  }
}
