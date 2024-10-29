import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { UpdatePaymentDto } from './dto/request/update-payment.dto';
import { ListPaymentsDto } from './dto/request/list-payments.dto';
import { PaymentDto } from './dto/response/payment.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentsService.create(createPaymentDto);
      return new PaymentDto(payment);
    } catch (error) {
      throw new BadRequestException(error.message, 'Error creating payment');
    }
  }

  @Get()
  async findAll(@Query() listPaymentsDto: ListPaymentsDto) {
    try {
      const payments = await this.paymentsService.findAll(listPaymentsDto);
      return payments.map((payment) => new PaymentDto(payment));
    } catch (error) {
      throw new BadRequestException(error.message, 'Error fetching payments');
    }
  }

  @Get('count')
  async getCount(@Query() listPaymentsDto: ListPaymentsDto) {
    try {
      return { count: await this.paymentsService.getCount(listPaymentsDto) };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        'Error fetching payments count',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.findOne(+id);
      return new PaymentDto(payment);
    } catch (error) {
      throw new BadRequestException(error.message, 'Error fetching payment');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    try {
      const payment = await this.paymentsService.update(+id, updatePaymentDto);
      return new PaymentDto(payment);
    } catch (error) {
      throw new BadRequestException(error.message, 'Error updating payment');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.paymentsService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error.message, 'Error deleting payment');
    }
  }
}
