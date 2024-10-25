import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import userFactory from '../factories/user.factory';
import companyFactory from '../factories/company.factory';
import paymentFactory from '../factories/payment.factory';
import UserSeeder from './user.seeder';
import CompanySeeder from './company.seeder';
import CategorySeeder from './category.seeder';
import categoryFactory from '../factories/category.factory';
import PaymentSeeder from './payment.seeder';

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder, CompanySeeder, CategorySeeder, PaymentSeeder],
      factories: [userFactory, companyFactory, categoryFactory, paymentFactory],
    });
  }
}
