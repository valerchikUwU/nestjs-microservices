import { CreateUserDto, ReadUserDto } from "@nestjs-microservices/shared";
import { HttpException, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

export class UserService {
    constructor(
        @Inject('USER_SERVICE') private readonly userNatsService: ClientProxy
    ) { }

    async findOneUserByEmail(email: string): Promise<ReadUserDto> {
        const user = await lastValueFrom<ReadUserDto>(this.userNatsService.send<ReadUserDto, string>('user.get_user_by_email', email)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return user
    }

    async findOneUserById(id: string): Promise<ReadUserDto> {
        const user = await lastValueFrom<ReadUserDto>(this.userNatsService.send<ReadUserDto, string>('user.get_user_by_id', id)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return user
    }

    async create(createUserDto: CreateUserDto): Promise<string> {
        const createdUserId = await lastValueFrom(this.userNatsService.send<string, CreateUserDto>('user.create_user', createUserDto)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return createdUserId
    }
}