import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { UpdatePaymentDto } from './dto/request/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { ListPaymentsDto } from './dto/request/list-payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return await this.paymentRepository.save(createPaymentDto);
  }

  async findAll(listPaymentsDto: ListPaymentsDto) {
    const paymentsQuery = this.getPaymentsQuery(listPaymentsDto);
    paymentsQuery.offset(listPaymentsDto.offset);
    paymentsQuery.limit(listPaymentsDto.limit);
    return await paymentsQuery.getMany();
  }

  async getCount(listPaymentsDto: ListPaymentsDto) {
    const paymentsQuery = this.getPaymentsQuery(listPaymentsDto);
    return paymentsQuery.getCount();
  }

  async findOne(id: number) {
    return await this.paymentRepository.findOne({
      where: { id },
      relations: ['company', 'category'],
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });
    return await this.paymentRepository.save({
      ...payment,
      ...updatePaymentDto,
    });
  }

  async remove(id: number) {
    return await this.paymentRepository.delete(id);
  }

  getPaymentsQuery(query: ListPaymentsDto) {
    const paymentsQuery = this.paymentRepository.createQueryBuilder('payment');
    paymentsQuery.distinct(true);
    paymentsQuery.leftJoinAndSelect('payment.company', 'company');
    paymentsQuery.leftJoinAndSelect('payment.category', 'category');
    if (query.search) {
      paymentsQuery.where('payment.description ILIKE :search', {
        search: `%${query.search}%`,
      });
      paymentsQuery.orWhere('company.name ILIKE :search', {
        search: `%${query.search}%`,
      });
      paymentsQuery.orWhere('category.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.sort) {
      paymentsQuery.addOrderBy('payment.' + query.sort, query.order || 'ASC');
    } else {
      paymentsQuery.addOrderBy('payment.createdAt', 'DESC');
    }

    return paymentsQuery;
  }
}
