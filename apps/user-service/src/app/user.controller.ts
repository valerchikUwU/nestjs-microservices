import { Controller, UseFilters } from '@nestjs/common';

import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExceptionFilter } from '../../../../shared/src/lib/utils/exceptionFilterRpc';
import { CreateUserDto } from '@nestjs-microservices/shared';

@UseFilters(new ExceptionFilter())
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern('user.get_user_by_email')
  async handleGetUserByEmail(@Payload() email: string) {
    const user = await this.userService.findOneUserByEmail(email);
    return user
  }

  @MessagePattern('user.get_user_by_id')
  async handleGetUserById(@Payload() id: string) {
    const user = await this.userService.findOneUserById(id);
    return user
  }

  @MessagePattern('user.create_user')
  async handleCreateUser(@Payload() createUserDto: CreateUserDto) {
    const createdUserId = await this.userService.create(createUserDto);
    return createdUserId;
  }
}
