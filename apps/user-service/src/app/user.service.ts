import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, ReadUserDto, RpcInternalServerException, RpcNotFoundException, User } from '@nestjs-microservices/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) { }


  async findOneUserById(id: string): Promise<ReadUserDto> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });
      if (!user) throw new RpcNotFoundException(`Not found user with id ${id}`);

      const userReadDto: ReadUserDto = plainToInstance(ReadUserDto, user)

      return userReadDto;
    }
    catch (err) {
      if (err instanceof RpcNotFoundException) {
        throw err;
      }
      throw new RpcInternalServerException('Internal Error of getting user by id');
    }

  }

  async findOneUserByEmail(email: string): Promise<ReadUserDto | null> {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      if (!user) {
        return null;
      }
      const userReadDto: ReadUserDto = plainToInstance(ReadUserDto, user)
      return userReadDto;
    }
    catch (err) {
      throw new RpcInternalServerException('Internal Error of getting user by email');
    }

  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    try {
      const user = plainToInstance(User, createUserDto);
      const createdUserId = await this.userRepository.insert(user);
      return createdUserId.identifiers[0].id
    }
    catch (err) {
      throw new RpcInternalServerException('Error while creating new user');
    }
  }
}
