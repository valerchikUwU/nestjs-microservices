import {
    Controller,
    Get,
    Param,
    Req,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ReadUserDto } from '@nestjs-microservices/shared';
import { UserService } from './user.service';
import { Request as ExpressRequest } from 'express';
import { AccessTokenGuard } from '../guards/accessToken.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get('me')
    @UseGuards(AccessTokenGuard)
    async findMe(
        @Req() req: ExpressRequest,
    ): Promise<object> {
        const user = req.user as ReadUserDto;
        const sessions = await this.userService.getUserSessions(user.id);
        return { user, sessions };
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async findUser(
        @Req() req: ExpressRequest,
        @Param('id') id: string
    ): Promise<object> {
        const user = await this.userService.getUserById(id);
        const sessions = await this.userService.getUserSessions(id);
        return { user, sessions };
    }
}
