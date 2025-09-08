import { Expose } from "class-transformer";

@Expose()
export class ReadFinancialDto {
    id: string;
    financialNumber: string;
    balance: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
