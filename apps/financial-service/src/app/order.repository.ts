import { Injectable } from '@nestjs/common';

import { Order } from '@nestjs-microservices/shared';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderRepository extends Repository<Order>{
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
}
