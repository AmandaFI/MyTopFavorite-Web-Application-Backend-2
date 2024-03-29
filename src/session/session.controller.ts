import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  SerializeOptions,
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
  @SerializeOptions({
    groups: ['completeUser'],
  })
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
  @SerializeOptions({
    groups: ['completeUser'],
  })
  @ApiOkResponse({
    description: 'Current logged user.',
    type: [UserEntity],
  })
  async status(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.find(
      req.currentUser.id,
      true,
      true,
      true,
    );
    if (user) return this.serialize(user);
    else throw new NotFoundException();
  }

  private serialize(user: User) {
    return new UserEntity(user);
  }
}
