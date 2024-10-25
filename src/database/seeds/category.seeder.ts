import { Category } from '../../categories/entities/category.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CategorySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const categoryFactory = factoryManager.get(Category);

    // Insert many records in database.
    await categoryFactory.saveMany(10);
  }
}
