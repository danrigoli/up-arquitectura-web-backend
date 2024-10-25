import { Company } from '../../companies/entities/company.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CompanySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const companyFactory = factoryManager.get(Company);

    // Insert many records in database.
    await companyFactory.saveMany(20);
  }
}
