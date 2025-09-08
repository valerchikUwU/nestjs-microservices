import {
    Body,
    Controller,
    Post,
    Get,
    Req,
    UseGuards,
    Param,
    Patch,
    ForbiddenException,
    BadRequestException,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { CreateFinancialDto, CreateOrderDto, Order, ReadFinancialDto, ReadOrderDto, ReadUserDto, UpdateFinancialDto } from '@nestjs-microservices/shared';
import { FinancialService } from './financial.service';
import { Request as ExpressRequest } from 'express';
import { AccessTokenGuard } from '../guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('financial')
export class FinancialController {
    constructor(private readonly financialService: FinancialService) { }


    @Get('get-financials')
    async findFinancials(
        @Req() req: ExpressRequest,
    ): Promise<ReadFinancialDto[]> {
        const user = req.user as ReadUserDto;
        const financials = await this.financialService.findFinancials(user.id);
        return financials;
    }

    @Get('get-orders')
    async findOrders(
        @Req() req: ExpressRequest,
        @Query('skip', ParseIntPipe) skip?: number
    ): Promise<ReadOrderDto[]> {
        const user = req.user as ReadUserDto;
        const orders = await this.financialService.findOrders(user.id, skip);
        return orders;
    }


    @Post('create')
    async create(
        @Req() req: ExpressRequest,
        @Body() createFinancialDto: CreateFinancialDto,
    ): Promise<object> {
        const user = req.user as ReadUserDto;
        createFinancialDto.userId = user.id;
        const createdFinancialId = await this.financialService.create(createFinancialDto);
        return { id: createdFinancialId };
    }

    @Patch(':financialId/deposit')
    async deposit(
        @Body() updateFinancialDto: UpdateFinancialDto,
        @Param('financialId') financialId: string,
    ): Promise<object> {
        updateFinancialDto.id = financialId;
        updateFinancialDto.balance = Math.abs(updateFinancialDto.balance);
        const updatedFinancialId = await this.financialService.deposit(updateFinancialDto);
        return { id: updatedFinancialId };
    }

    @Patch(':financialId/withdrawal')
    async withdrawal(
        @Body() updateFinancialDto: UpdateFinancialDto,
        @Param('financialId') financialId: string,
    ): Promise<object> {
        updateFinancialDto.id = financialId;
        updateFinancialDto.balance = -Math.abs(updateFinancialDto.balance);
        const updatedFinancialId = await this.financialService.withdrawal(updateFinancialDto);
        return { id: updatedFinancialId };
    }


    @Post('createOrder')
    @UseGuards(AccessTokenGuard)
    async sell(
        @Req() req: ExpressRequest,
        @Body() createOrderDto: CreateOrderDto,
    ): Promise<Order> {
        const user = req.user as ReadUserDto;
        const financials = await this.financialService.findFinancials(user.id);
        if (financials.length === 0) {
            throw new ForbiddenException('No financial accounts found for user');
        }
        if (createOrderDto.operation === 'buy' && (financials[0].balance - createOrderDto.amount < 0)) {
            throw new BadRequestException('Not enough rubles!');
        }
        createOrderDto.financialId = financials[0].id;
        createOrderDto.balance = financials[0].balance;
        createOrderDto.userId = user.id;
        const createdOrder = await this.financialService.createOrder(createOrderDto)
        return createdOrder
    }

}
