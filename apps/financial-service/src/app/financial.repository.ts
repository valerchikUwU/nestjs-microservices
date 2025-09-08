import { Injectable } from '@nestjs/common';

import { Financial } from '@nestjs-microservices/shared';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FinancialRepository extends Repository<Financial>{
  constructor(private dataSource: DataSource) {
    super(Financial, dataSource.createEntityManager());
  }
}
