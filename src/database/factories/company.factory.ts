import { Company } from '../../companies/entities/company.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Company, async (faker) => {
  const company = new Company();
  company.name = faker.company.name();
  company.address = faker.location.streetAddress();

  return company;
});
