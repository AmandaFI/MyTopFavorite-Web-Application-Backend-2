import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import {
  AuthenticateUserGuard,
  AuthenticatedRequest,
} from 'src/authorization/guards/authenticate.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUnfollowUserDto } from './dto/follow-unfollow-user.dto';
import { throwError } from 'rxjs';

@Controller('api/users')
@UseGuards(AuthenticateUserGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index() {
    const users = await this.userService.findAll();

    return users.map((user) => this.serialize(user));
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.find(id);

    if (user) return this.serialize(user);
    else throw new NotFoundException();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(createUser: CreateUserDto) {
    const user = await this.userService.create(createUser);

    if (user) return this.serialize(user);
    else throw new UnprocessableEntityException();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() updatedUser: UpdateUserDto,
  ) {
    const user = await this.userService.update(req.currentUser.id, updatedUser);

    if (user) return this.serialize(user);
    else throw new UnprocessableEntityException();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    const _user = this.userService.delete(id);
  }

  @Post('follow')
  @HttpCode(HttpStatus.CREATED)
  async follow(
    @Req() req: AuthenticatedRequest,
    @Body() data: FollowUnfollowUserDto,
  ) {
    const followedUsers = await this.userService.follow(
      req.currentUser.id,
      data.userId,
    );

    if (followedUsers) {
      const followedUser = await this.userService.find(data.userId);
      if (followedUser) return this.serialize(followedUser);
      else throw new NotFoundException();
    } else throw new UnprocessableEntityException();
  }

  @Delete('unfollow')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(
    @Req() req: AuthenticatedRequest,
    @Query('user_id', ParseIntPipe) user_id: number,
  ) {
    const user = this.userService.unfollow(req.currentUser.id, user_id);

    if (!user) throw new UnprocessableEntityException();
  }

  private serialize(user: User) {
    return new UserEntity(user);
  }
}
