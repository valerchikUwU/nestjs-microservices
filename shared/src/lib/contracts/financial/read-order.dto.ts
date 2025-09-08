import { Expose } from "class-transformer";
import { AllowedValutes } from "../../domains/order.entity";

@Expose()
export class ReadOrderDto {

    id: string;

    userId: string;

    balanceOfValute: number;

    orderNumber: number;

    valute: AllowedValutes;

    createdAt: Date;

    updatedAt: Date;
}