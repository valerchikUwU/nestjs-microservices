import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {  

  firstName: string;

  lastName: string;

  middleName?: string;

  telephoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
