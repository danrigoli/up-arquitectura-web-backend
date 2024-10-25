import { Category } from '../../categories/entities/category.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Category, async (faker) => {
  const category = new Category();
  category.name = faker.commerce.department();
  return category;
});
