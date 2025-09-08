import { Injectable } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';
import { AllowedValutes, CreateFinancialDto, CreateOrderDto, OPERATIONS, Order, ReadFinancialDto, ReadOrderDto, RpcBadRequestException, RpcInternalServerException, RpcNotFoundException, UpdateFinancialDto } from '@nestjs-microservices/shared';
import { OrderRepository } from './order.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FinancialService {
  constructor(
    private readonly financialRepository: FinancialRepository,
    private readonly orderRepository: OrderRepository
  ) { }

  async findFinancialsByIdAndUserId(userId: string): Promise<ReadFinancialDto[]> {
    try {
      const financials = await this.financialRepository.findBy({ userId: userId });
      return plainToInstance(ReadFinancialDto, financials);
    }
    catch (err) {
      throw new RpcInternalServerException('Ошибка при получении счетов по userId');
    }
  }

  async create(createFinancialDto: CreateFinancialDto): Promise<string> {
    try {
      createFinancialDto.balance = 0;
      createFinancialDto.financialNumber = (Math.floor(Date.now() + Math.random() * 900000000)).toString();
      const createdFinancialId = await this.financialRepository.insert(createFinancialDto);
      return createdFinancialId.identifiers[0].id;
    }
    catch (err) {
      throw new RpcInternalServerException('Ошибка при создании счета');
    }
  }

  async update(updateFinancialDto: UpdateFinancialDto) {
    try {
      const financial = await this.financialRepository.findOneBy({ id: updateFinancialDto.id });
      if (!financial) {
        throw new RpcNotFoundException(`Financial record with id: ${updateFinancialDto.id} not found`);
      }
      if (financial.balance + updateFinancialDto.balance < 0) {
        throw new RpcBadRequestException(`Not enough balance`);
      }
      updateFinancialDto.balance += financial.balance;
      await this.financialRepository.update(updateFinancialDto.id, { balance: updateFinancialDto.balance });
      return updateFinancialDto.id;
    }
    catch (err) {
      if (err instanceof RpcNotFoundException) {
        throw err;
      }
      if (err instanceof RpcBadRequestException) {
        throw err;
      }
      throw new RpcInternalServerException('Ошибка при обновлении счета');
    }
  }

  async findAllOrdersForUser(userId: string, pagination?: number): Promise<ReadOrderDto[]> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          userId: userId
        },
        order: {
          createdAt: 'DESC'
        },
        take: 50,
        skip: pagination ?? 0
      });
      const readOrderDto: ReadOrderDto[] = plainToInstance(ReadOrderDto, orders);
      return readOrderDto;
    }
    catch (err) {
      throw new RpcInternalServerException('Ошибка получения всех переводов')
    }
  }


  async findLastOrderByValuteCode(valuteCode: keyof typeof AllowedValutes): Promise<ReadOrderDto | null> {
    try {
      const order = await this.orderRepository.find({
        where: {
          valuteCode: AllowedValutes[valuteCode]
        },
        order: {
          orderNumber: 'DESC'
        },
        take: 1
      });
      if (!order) {
        return null;
      }
      const readOrderDto: ReadOrderDto = plainToInstance(ReadOrderDto, order[0]);
      return readOrderDto;
    }
    catch (err) {
      throw new RpcInternalServerException('Ошибка получения последнего перевода по валюте')
    }
  }


  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const allowedValute = Object.keys(AllowedValutes).find(k => AllowedValutes[k as keyof typeof AllowedValutes] === createOrderDto.valuteFrom.CharCode) as keyof typeof AllowedValutes;
      const previousOrder = await this.findLastOrderByValuteCode(allowedValute);
      const actualValuteBalance: number = previousOrder ? previousOrder.balanceOfValute : 0;
      const order = new Order();
      let newFinancialBalance = 0;
      if (createOrderDto.operation === OPERATIONS.BUY) {
        order.balanceOfValute = actualValuteBalance + createOrderDto.amount / createOrderDto.valuteFrom.bid;
        order.userId = createOrderDto.userId;
        order.valuteCode = AllowedValutes[allowedValute];
        newFinancialBalance = createOrderDto.balance - createOrderDto.amount;
      }
      else {
        order.balanceOfValute = actualValuteBalance - createOrderDto.amount / createOrderDto.valuteFrom.ask
        if (order.balanceOfValute < 0) {
          throw new RpcBadRequestException(`Not enough ${createOrderDto.valuteFrom.CharCode}`)
        }
        order.userId = createOrderDto.userId;
        order.valuteCode = AllowedValutes[allowedValute];
        newFinancialBalance = createOrderDto.balance + createOrderDto.amount;
      }
      const [createdOrder, updatedFinancialId] = await Promise.all([
        this.orderRepository.save(order),
        this.financialRepository.update(createOrderDto.financialId, { balance: newFinancialBalance })
      ]);
      return createdOrder;
    }
    catch (err) {
      if (err instanceof RpcBadRequestException) {
        throw err;
      }
      throw new RpcInternalServerException('Ошибка при создании перевода')
    }
    
  }
}