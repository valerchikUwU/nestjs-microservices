import { Controller } from '@nestjs/common';

import { FinancialService } from './financial.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFinancialDto, CreateOrderDto, Order, ReadFinancialDto, ReadOrderDto, UpdateFinancialDto } from '@nestjs-microservices/shared';

@Controller()
export class FinancialController {
  constructor(private readonly financialService: FinancialService) { }

  @MessagePattern('financial.find_financials')
  async handleFindFinancials(@Payload() userId: string): Promise<ReadFinancialDto[]> {
    const financials = await this.financialService.findFinancialsByIdAndUserId(userId);
    return financials;
  }

  @MessagePattern('financial.find_orders')
  async handleFindOrders(@Payload() data: { userId: string, skip?: number }): Promise<ReadOrderDto[]> {
    const orders = await this.financialService.findAllOrdersForUser(data.userId, data.skip);
    return orders;
  }

  @MessagePattern('financial.create_financial')
  async handleCreateFinancial(@Payload() createFinancialDto: CreateFinancialDto): Promise<string> {
    const createdFinancialId = await this.financialService.create(createFinancialDto);
    return createdFinancialId;
  }

  @MessagePattern('financial.deposit')
  async handleDeposit(@Payload() updateFinancialDto: UpdateFinancialDto): Promise<string> {
    const updatedFinancialId = await this.financialService.update(updateFinancialDto);
    return updatedFinancialId;
  }

  @MessagePattern('financial.withdrawal')
  async handleWithdrawal(@Payload() updateFinancialDto: UpdateFinancialDto): Promise<string> {
    const updatedFinancialId = await this.financialService.update(updateFinancialDto);
    return updatedFinancialId;
  }

  @MessagePattern('financial.createOrder')
  async handleCreateOrder(@Payload() createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = await this.financialService.createOrder(createOrderDto);
    return createdOrder;
  }

}
