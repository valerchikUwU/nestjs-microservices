import {
    IsUUID,
} from 'class-validator';

export class CreateFinancialDto {

    balance: number;

    financialNumber: string;

    @IsUUID()
    userId: string;
    
}
