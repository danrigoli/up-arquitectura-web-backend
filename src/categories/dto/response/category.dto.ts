import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';

export class CategoryDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'Category name' })
  name?: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt?: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt?: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
