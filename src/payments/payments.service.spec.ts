import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { ListPaymentsDto } from './dto/request/list-payments.dto';
import { UpdatePaymentDto } from './dto/request/update-payment.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let repository: Repository<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    repository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment', async () => {
    const createPaymentDto: CreatePaymentDto = {
      ...createPayment(),
    };
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(createPaymentDto as Payment);

    expect(await service.create(createPaymentDto)).toEqual(createPaymentDto);
  });

  it('should find all payments', async () => {
    const listPaymentsDto: ListPaymentsDto = { offset: 0, limit: 10 };
    const payments: Payment[] = [
      /* mock data */
    ];
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      distinct: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(payments),
    } as any);

    expect(await service.findAll(listPaymentsDto)).toEqual(payments);
  });

  it('should get payment count', async () => {
    const listPaymentsDto: ListPaymentsDto = { offset: 0, limit: 10 };
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      distinct: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(5),
    } as any);

    expect(await service.getCount(listPaymentsDto)).toEqual(5);
  });

  it('should find one payment', async () => {
    const payment: Payment = createPayment();
    jest.spyOn(repository, 'findOne').mockResolvedValue(payment);

    expect(await service.findOne(1)).toEqual(payment);
  });

  it('should update a payment', async () => {
    const updatePaymentDto: UpdatePaymentDto = {
      id: 1,
    };
    const payment: Payment = createPayment();
    jest.spyOn(repository, 'findOne').mockResolvedValue(payment);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue({ ...payment, ...updatePaymentDto });

    expect(await service.update(1, updatePaymentDto)).toEqual({
      ...payment,
      ...updatePaymentDto,
    });
  });

  it('should remove a payment', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.remove(1)).toEqual({ affected: 1 });
  });
});

const createPayment = (data: Partial<Payment> = {}): Payment => {
  return {
    id: 1,
    amount: Math.random() * 1000,
    date: new Date(),
    description: 'Payment Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    companyId: 1,
    company: {
      id: 1,
      name: 'Company Name',
      address: 'Company Address',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    category: {
      id: 1,
      name: 'Category Name',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ...data,
  };
};
