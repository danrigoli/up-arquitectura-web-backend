import { Category } from '../../categories/entities/category.entity';
import { Company } from '../../companies/entities/company.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class PaymentSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const companyRepository = dataSource.getRepository(Company);
    const companies = await companyRepository.find();

    const categoryRepository = dataSource.getRepository(Category);
    const categories = await categoryRepository.find();

    const paymentFactory = factoryManager.get(Payment);

    for (const company of companies) {
      await paymentFactory.saveMany(10, {
        company: company,
        category: categories[Math.floor(Math.random() * categories.length)],
      });
    }
  }
}
