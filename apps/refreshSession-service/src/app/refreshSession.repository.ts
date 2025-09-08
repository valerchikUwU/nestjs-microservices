import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RefreshSession } from "@nestjs-microservices/shared"

@Injectable()
export class RefreshSessionRepository extends Repository<RefreshSession> {
    constructor(private dataSource: DataSource) {
        super(RefreshSession, dataSource.createEntityManager());
    }
}
