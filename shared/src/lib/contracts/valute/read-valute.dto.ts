import { IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

export class Currency {

  @IsString()
  ID: string;

  @IsString()
  NumCode: string;

  @IsString()
  CharCode: string;

  @IsNumber()
  Nominal: number;

  @IsString()
  Name: string;

  @IsNumber()
  Value: number;

  @IsNumber()
  Previous: number;

  @IsNumber()
  ask: number;
  
  @IsNumber()
  bid: number;

}

export class Valute {
  [key: string]: Currency;
}

export class Course {

  @Type(() => Date)
  Date: Date;

  @IsString()
  PreviousDate: string;

  @IsString()
  PreviousURL: string;

  @IsString()
  Timestamp: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Valute)
  Valute: Valute;
}