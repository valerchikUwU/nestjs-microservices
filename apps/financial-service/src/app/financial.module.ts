import { Module } from '@nestjs/common';
import { FinancialController } from './financial.controller';
import { FinancialService } from './financial.service';
import { FinancialRepository } from './financial.repository';
import { Financial, Order } from '@nestjs-microservices/shared';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(__dirname, '../../../../.env'), 
        path.resolve(__dirname, '../../.env'),
      ],
    }),
    TypeOrmModule.forFeature([Financial, Order]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      database: process.env.FINANCIAL_POSTGRES_DB,
      entities: [Financial, Order],
      synchronize: true,
      username: 'financial_db',
      password: 'financial_pass',
    }),
  ],
  controllers: [FinancialController],
  providers: [FinancialService, FinancialRepository, OrderRepository],
})
export class FinancialModule {}
