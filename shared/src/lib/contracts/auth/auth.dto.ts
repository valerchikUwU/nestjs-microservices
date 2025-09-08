import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsUUID()
  userId: string;
}
