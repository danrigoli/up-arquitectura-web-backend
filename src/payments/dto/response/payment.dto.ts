import { Payment } from 'src/payments/entities/payment.entity';
import { CompanyDto } from 'src/companies/dto/response/company.dto';
import { CategoryDto } from 'src/categories/dto/response/category.dto';

export class PaymentDto {
  id?: number;
  amount?: number;
  date?: Date;
  description?: string;
  company: CompanyDto;
  category: CategoryDto;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.amount = payment.amount;
    this.date = payment.date;
    this.description = payment.description;
    if (payment.company) {
      this.company = new CompanyDto(payment.company);
    }
    if (payment.category) {
      this.category = new CategoryDto(payment.category);
    }
  }
}
