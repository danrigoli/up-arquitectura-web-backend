import { Payment } from 'src/payments/entities/payment.entity';
import { CompanyDto } from 'src/companies/dto/response/company.dto';
import { CategoryDto } from 'src/categories/dto/response/category.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 100 })
  amount?: number;

  @ApiProperty({ example: '2021-01-01' })
  date?: Date;

  @ApiProperty({ example: 'Payment description' })
  description?: string;

  @ApiProperty({ type: CompanyDto })
  company: CompanyDto;

  @ApiProperty({ type: CategoryDto })
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
