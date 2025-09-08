import {
  IsOptional,
  IsString,
  IsIP,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateRefreshSessionDto {
  @IsString()
  @IsNotEmpty()
  user_agent: string;

  @IsString()
  @IsNotEmpty()
  fingerprint: string;

  @IsIP()
  @IsNotEmpty()
  ip: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  expiresIn: number;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsUUID()
  userId: string;
}
