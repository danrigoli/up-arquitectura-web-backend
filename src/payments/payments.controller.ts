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
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
@ApiTags('payments')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Payment created',
    type: PaymentDto,
  })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentsService.create(createPaymentDto);
      return new PaymentDto(payment);
    } catch (error) {
      throw new BadRequestException(error.message, 'Error creating payment');
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of payments',
    type: PaymentDto,
    isArray: true,
  })
  async findAll(@Query() listPaymentsDto: ListPaymentsDto) {
    try {
      const payments = await this.paymentsService.findAll(listPaymentsDto);
      return payments.map((payment) => new PaymentDto(payment));
    } catch (error) {
      throw new BadRequestException(error.message, 'Error fetching payments');
    }
  }

  @Get('count')
  @ApiResponse({
    status: 200,
    description: 'Count of payments',
    type: Number,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Payment found',
    type: PaymentDto,
  })
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.findOne(+id);
      return new PaymentDto(payment);
    } catch (error) {
      throw new BadRequestException(error.message, 'Error fetching payment');
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Payment updated',
    type: PaymentDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Payment deleted',
  })
  async remove(@Param('id') id: string) {
    try {
      return await this.paymentsService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error.message, 'Error deleting payment');
    }
  }
}
