import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
import {
  AuthenticateUserGuard,
  AuthenticatedRequest,
} from 'src/authorization/guards/authenticate.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

declare module 'express-session' {
  export interface SessionData {
    currentUserId: User['id'];
  }
}

@ApiTags('sessions')
@Controller('api/sessions')
export class SessionController {
  constructor(private readonly userService: UserService) {}

  // login
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Successful login.',
    type: UserEntity,
  })
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Req() req: Request,
  ) {
    const user = await this.userService.authenticate(createSessionDto);
    if (!user) throw new UnauthorizedException();

    req.session.currentUserId = user.id;

    return this.serialize(user);
  }

  // logout
  @UseGuards(AuthenticateUserGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Successful login.',
  })
  async logout(@Req() req: AuthenticatedRequest) {
    req.session.currentUserId = undefined;
  }

  @UseGuards(AuthenticateUserGuard)
  @Get('status')
  @ApiOkResponse({
    description: 'Current logged user.',
    type: [UserEntity],
  })
  async status(@Req() req: AuthenticatedRequest) {
    return this.serialize(req.currentUser);
  }

  private serialize(user: User) {
    return new UserEntity(user);
  }
}
