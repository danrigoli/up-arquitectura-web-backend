import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { UpdatePaymentDto } from './dto/request/update-payment.dto';
import { ListPaymentsDto } from './dto/request/list-payments.dto';
import { PaymentDto } from './dto/response/payment.dto';
import { BadRequestException } from '@nestjs/common';
import { Payment } from './entities/payment.entity';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            getCount: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        amount: 100,
        date: new Date(),
        description: 'Payment Description',
        categoryId: 1,
        companyId: 1,
      };
      const payment = createPayment(createPaymentDto);
      jest.spyOn(service, 'create').mockResolvedValue(payment);

      expect(await controller.create(createPaymentDto)).toEqual(
        new PaymentDto(payment),
      );
    });

    it('should throw BadRequestException on error', async () => {
      const createPaymentDto: CreatePaymentDto = {
        amount: 0,
        date: new Date(),
        description: '',
        categoryId: 0,
        companyId: 0,
      };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Error creating payment'));

      await expect(controller.create(createPaymentDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      const listPaymentsDto: ListPaymentsDto = {};
      const payments = [createPayment(), createPayment()];
      jest.spyOn(service, 'findAll').mockResolvedValue(payments);

      expect(await controller.findAll(listPaymentsDto)).toEqual(
        payments.map((payment) => new PaymentDto(payment)),
      );
    });

    it('should throw BadRequestException on error', async () => {
      const listPaymentsDto: ListPaymentsDto = {
        /* mock data */
      };
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Error fetching payments'));

      await expect(controller.findAll(listPaymentsDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getCount', () => {
    it('should return the count of payments', async () => {
      const listPaymentsDto: ListPaymentsDto = {
        /* mock data */
      };
      const count = 5;
      jest.spyOn(service, 'getCount').mockResolvedValue(count);

      expect(await controller.getCount(listPaymentsDto)).toEqual({ count });
    });

    it('should throw BadRequestException on error', async () => {
      const listPaymentsDto: ListPaymentsDto = {
        /* mock data */
      };
      jest
        .spyOn(service, 'getCount')
        .mockRejectedValue(new Error('Error fetching payments count'));

      await expect(controller.getCount(listPaymentsDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a payment', async () => {
      const payment = createPayment();
      jest.spyOn(service, 'findOne').mockResolvedValue(payment);

      expect(await controller.findOne('1')).toEqual(new PaymentDto(payment));
    });

    it('should throw BadRequestException on error', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Error fetching payment'));

      await expect(controller.findOne('1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const updatePaymentDto: UpdatePaymentDto = {
        id: 1,
        amount: 100,
      };
      const payment = createPayment(updatePaymentDto);
      jest.spyOn(service, 'update').mockResolvedValue(payment);

      expect(await controller.update('1', updatePaymentDto)).toEqual(
        new PaymentDto(payment),
      );
    });

    it('should throw BadRequestException on error', async () => {
      const updatePaymentDto: UpdatePaymentDto = {
        id: 1,
        amount: 0,
        description: '',
      };
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Error updating payment'));

      await expect(controller.update('1', updatePaymentDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a payment', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
    });

    it('should throw BadRequestException on error', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Error deleting payment'));

      await expect(controller.remove('1')).rejects.toThrow(BadRequestException);
    });
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
