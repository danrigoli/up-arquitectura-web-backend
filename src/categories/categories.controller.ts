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
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Category created',
    type: CategoryDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: CategoryDto,
    isArray: true,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Count of categories',
  })
  async getCount(@Query() listCategoriesDto: ListCategoriesDto) {
    return { count: await this.categoriesService.getCount(listCategoriesDto) };
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: CategoryDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Category updated',
    type: CategoryDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Category deleted',
  })
  async remove(@Param('id') id: string) {
    try {
      return await this.categoriesService.remove(+id);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error deleting category');
    }
  }
}
