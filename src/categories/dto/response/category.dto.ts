import { Category } from 'src/categories/entities/category.entity';

export class CategoryDto {
  id?: number;
  name?: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
  }
}
