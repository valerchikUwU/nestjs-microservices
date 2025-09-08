import {
    IsNumber,
} from 'class-validator';

export class UpdateFinancialDto {

    id: string;

    @IsNumber()
    balance: number;
}
