import { Payment } from 'src/payments/entities/payment.entity';
import { CompanyDto } from 'src/companies/dto/response/company.dto';

export class PaymentDto {
  id?: number;
  amount?: number;
  date?: Date;
  description?: string;
  company: CompanyDto;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.amount = payment.amount;
    this.date = payment.date;
    this.description = payment.description;
    if (payment.company) {
      this.company = new CompanyDto(payment.company);
    }
  }
}
