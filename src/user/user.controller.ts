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
  SerializeOptions,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { List, User } from '@prisma/client';
import {
  AuthenticateUserGuard,
  AuthenticatedRequest,
} from 'src/authorization/guards/authenticate.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserIdDto } from './dto/user-id.dto';
import { UserNameDto } from './dto/user-name.dto';
import { UserEntity } from './entities/user.entity';
import { ListEntity } from 'src/list/entities/list.entity';
import { ListService } from 'src/list/list.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly listService: ListService,
  ) {}

  @Post('follow')
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiCreatedResponse({
    description: 'User followed.',
    type: UserEntity,
  })
  async follow(@Req() req: AuthenticatedRequest, @Body() data: UserIdDto) {
    const followedUsers = await this.userService.follow(
      req.currentUser.id,
      data.userId,
    );

    if (followedUsers) {
      const followedUser = await this.userService.find(
        data.userId,
        true,
        true,
        true,
      );
      if (followedUser) return this.serialize(followedUser);
      else throw new NotFoundException();
    } else throw new UnprocessableEntityException();
  }

  @Post('find_users')
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiCreatedResponse({
    description: 'Users found.',
    type: [UserEntity],
  })
  async findUsers(@Req() req: AuthenticatedRequest, @Body() data: UserNameDto) {
    const users = await this.userService.findUsersByName(data.name);

    return users.map((user) => this.serialize(user));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @ApiCreatedResponse({
    description: 'User created.',
    type: UserEntity,
  })
  async create(@Body() createUser: CreateUserDto) {
    const user = await this.userService.create(createUser);

    if (user) return this.serialize(user);
    else throw new UnprocessableEntityException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiOkResponse({
    description: 'User updated.',
    type: UserEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUser: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updatedUser);

    if (user) return this.serialize(user);
    else throw new UnprocessableEntityException();
  }

  @Delete('unfollow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthenticateUserGuard)
  @ApiNoContentResponse({
    description: 'User unfollowed.',
  })
  async unfollow(
    @Req() req: AuthenticatedRequest,
    @Query('user_id', ParseIntPipe) user_id: number,
  ) {
    const user = this.userService.unfollow(req.currentUser.id, user_id);

    if (!user) throw new UnprocessableEntityException();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthenticateUserGuard)
  @ApiNoContentResponse({
    description: 'User deleted.',
  })
  async destroy(@Param('id', ParseIntPipe) id: number) {
    const _user = this.userService.delete(id);
  }

  @Get(':id/check_following')
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiOkResponse({
    description: 'Relation checked.',
    type: UserEntity,
  })
  async checkFollowing(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.userService.checkFollowing(req.currentUser.id, id);

    if (user) return this.serialize(user);
    else throw new NotFoundException();
  }

  @Get('followed_users')
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiOkResponse({
    description: 'Followed users.',
    type: [UserEntity],
  })
  async followedUsers(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.find(
      req.currentUser.id,
      false,
      true,
      false,
    );

    if (user) {
      return user.followedUsers.map((user) => this.serialize(user));
    } else throw new NotFoundException();
  }

  @Get('followers')
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiOkResponse({
    description: 'Followers.',
    type: [UserEntity],
  })
  async followers(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.find(
      req.currentUser.id,
      true,
      false,
      false,
    );

    if (user) {
      return user.followers.map((user) => this.serialize(user));
    } else throw new NotFoundException();
  }

  // ao usar a pipe ParseIntPipe, o Query param se torna obrigatório
  // par ser opcional basta remover o pipe e não esquecer de fazer o parse para number
  @Get('followed_users_lists')
  @SerializeOptions({
    groups: ['completeList'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiOkResponse({
    description: 'Lists of the users followed by the logged user.',
    type: [UserEntity],
  })
  async followedUserLists(
    @Req() req: AuthenticatedRequest,
    @Query('page') pageParam?: string,
    @Query('per_page') perPageParam?: string,
  ) {
    let page = pageParam ? +pageParam : undefined;
    let perPage = perPageParam ? +perPageParam : undefined;

    const user = await this.userService.followedUsersLists(
      req.currentUser.id,
      page,
      perPage,
    );

    // if (user) {
    //   return user.lists.map(async (list) => {
    //     const likedByCurrentUser = (await this.listService.checkLiker(
    //       list.id,
    //       req.currentUser.id,
    //     ))
    //       ? true
    //       : false;
    //     const serializedList = this.serializeList(list, likedByCurrentUser);
    //     console.log(serializedList);
    //     return serializedList;
    //   });
    // }

    if (user) return user.lists;
  }

  @Get(':id')
  @SerializeOptions({
    groups: ['completeUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiOkResponse({
    description: 'User.',
    type: UserEntity,
  })
  async show(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.find(id, true, true, true);

    if (user) return this.serialize(user);
    else throw new NotFoundException();
  }

  @Get()
  @SerializeOptions({
    groups: ['basicUser'],
  })
  @UseGuards(AuthenticateUserGuard)
  @ApiOkResponse({
    description: 'Users.',
    type: [UserEntity],
  })
  async index() {
    const users = await this.userService.findAll();

    return users.map((user) => this.serialize(user));
  }

  private serialize(user: User) {
    return new UserEntity(user);
  }

  private serializeList(list: List, likedByUser?: boolean) {
    return new ListEntity(list, likedByUser);
  }
}
