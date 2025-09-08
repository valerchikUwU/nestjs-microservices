import { IsEnum, IsIn, IsNumber, IsString, Min, ValidateNested } from "class-validator";
import { Currency } from "../valute/read-valute.dto";
import { Type } from "class-transformer";

export enum OPERATIONS {
    SELL='sell',
    BUY='buy'
}

export class CreateOrderDto {

    @ValidateNested()
    @Type(() => Currency)
    valuteFrom: Currency;

    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsString()
    @IsEnum(OPERATIONS)
    operation: OPERATIONS

    balance: number;

    userId: string;

    financialId: string
}