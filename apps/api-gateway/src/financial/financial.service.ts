import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateFinancialDto, CreateOrderDto, Order, ReadFinancialDto, ReadOrderDto, UpdateFinancialDto } from '@nestjs-microservices/shared';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FinancialService {
    constructor(
        @Inject('FINANCIAL_SERVICE') private readonly financialNatsClient: ClientProxy,
    ) { }

    async findFinancials(userId: string): Promise<ReadFinancialDto[]> {
        const financials = await lastValueFrom(this.financialNatsClient.send<ReadFinancialDto[], string>('financial.find_financials', userId)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return financials;
    }

    async findOrders(userId: string, skip: number): Promise<ReadOrderDto[]> {
        const orders = await lastValueFrom(this.financialNatsClient.send<ReadOrderDto[], { userId: string, skip?: number }>('financial.find_orders', { userId, skip })).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return orders;
    }

    async create(createFinancialDto: CreateFinancialDto): Promise<string> {
        const createdFinancialId = await lastValueFrom(this.financialNatsClient.send<string, CreateFinancialDto>('financial.create_financial', createFinancialDto)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return createdFinancialId;
    }

    async deposit(updateFinancialDto: UpdateFinancialDto): Promise<string> {
        const updatedFinancialId = await lastValueFrom(this.financialNatsClient.send<string, UpdateFinancialDto>('financial.deposit', updateFinancialDto)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return updatedFinancialId;
    }

    async withdrawal(updateFinancialDto: UpdateFinancialDto): Promise<string> {
        const updatedFinancialId = await lastValueFrom(this.financialNatsClient.send<string, UpdateFinancialDto>('financial.withdrawal', updateFinancialDto)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return updatedFinancialId;
    }

    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const order = await lastValueFrom(this.financialNatsClient.send<Order, CreateOrderDto>('financial.createOrder', createOrderDto)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return order;
    }
}