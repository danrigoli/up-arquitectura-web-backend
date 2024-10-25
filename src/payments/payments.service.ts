import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { UpdatePaymentDto } from './dto/request/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentDto } from './dto/response/payment.dto';
import { ListPaymentsDto } from './dto/request/list-payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentRepository.save(createPaymentDto);
      return new PaymentDto(payment);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error creating payment');
    }
  }

  async findAll(listPaymentsDto: ListPaymentsDto) {
    try {
      const paymentsQuery = this.getPaymentsQuery(listPaymentsDto);
      paymentsQuery.offset(listPaymentsDto.offset);
      paymentsQuery.limit(listPaymentsDto.limit);
      const payments = await paymentsQuery.getMany();
      return payments.map((payment) => new PaymentDto(payment));
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error fetching payments');
    }
  }

  async getCount(listPaymentsDto: ListPaymentsDto) {
    try {
      const paymentsQuery = this.getPaymentsQuery(listPaymentsDto);
      return paymentsQuery.getCount();
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(
        error.message,
        'Error fetching payments count',
      );
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
        relations: ['company', 'category'],
      });
      return new PaymentDto(payment);
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error fetching payment');
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
      });
      return await this.paymentRepository.save({
        ...payment,
        ...updatePaymentDto,
      });
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error updating payment');
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.paymentRepository.softDelete(id);
      return deleteResult;
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException(error.message, 'Error deleting payment');
    }
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
