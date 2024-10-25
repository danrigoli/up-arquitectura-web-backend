import { Payment } from '../../payments/entities/payment.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Payment, async (faker) => {
  const payment = new Payment();
  payment.amount = parseFloat(faker.finance.amount());
  payment.date = faker.date.past();
  payment.description = faker.company.catchPhrase();
  return payment;
});
