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
import {
  AuthenticateUserGuard,
  AuthenticatedRequest,
} from 'src/authorization/guards/authenticate.guard';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List, User } from '@prisma/client';
import { ListEntity } from './entities/list.entity';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

@ApiTags('lists')
@Controller('api/lists')
@UseGuards(AuthenticateUserGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get('draft_lists')
  @SerializeOptions({
    groups: ['basicList'],
  })
  @ApiOkResponse({
    description: 'Logged user drafted lists.',
    type: [ListEntity],
  })
  async draftLists(@Req() req: AuthenticatedRequest) {
    const lists = await this.listService.draftLists(req.currentUser.id);

    if (lists) return lists.map((list) => this.serialize(list));
    else throw new NotFoundException();
  }

  @Get(':id/published_lists')
  @SerializeOptions({
    groups: ['basicList'],
  })
  @ApiOkResponse({
    description: 'User published lists.',
    type: [ListEntity],
  })
  async publishedLists(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') pageParam?: string,
    @Query('per_page') perPageParam?: string,
  ) {
    let page = pageParam ? +pageParam : undefined;
    let perPage = perPageParam ? +perPageParam : undefined;

    const lists = await this.listService.publishedLists(id, page, perPage);

    if (lists) return lists.map((list) => this.serialize(list));
    else throw new NotFoundException();
  }

  @Get(':id')
  @SerializeOptions({
    groups: ['completeList'],
  })
  @ApiOkResponse({
    description: 'User lsit.',
    type: ListEntity,
  })
  async show(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const list = await this.listService.find(id, {
      category: true,
      user: true,
      items: true,
      likers: true,
    });

    if (list) {
      const likedByUser = await this.listService.checkLiker(
        id,
        req.currentUser.id,
      );
      const likedByCurrentUser = likedByUser ? true : false;
      return this.serialize(list, likedByCurrentUser);
    } else throw new NotFoundException();
  }

  @Get()
  @SerializeOptions({
    groups: ['basicList'],
  })
  @ApiOkResponse({
    description: 'Logged user lists.',
    type: [ListEntity],
  })
  async index(@Req() req: AuthenticatedRequest) {
    const lists = await this.listService.findMany(req.currentUser.id, {
      category: true,
      items: true,
      likers: true,
    });

    if (lists) return lists.map((list) => this.serialize(list));
    else throw new NotFoundException();
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'List liked.',
    type: UserEntity,
  })
  async like(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const list = await this.listService.like(req.currentUser.id, id);

    if (list) return this.serializeUser(req.currentUser);
    else throw new UnprocessableEntityException();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({
    groups: ['basicList'],
  })
  @ApiCreatedResponse({
    description: 'List created.',
    type: ListEntity,
  })
  async create(@Req() req: AuthenticatedRequest, @Body() list: CreateListDto) {
    const createdList = await this.listService.create(req.currentUser.id, list);

    if (createdList) return this.serialize(createdList);
    else throw new UnprocessableEntityException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: ['basicList'],
  })
  @ApiOkResponse({
    description: 'List updated.',
    type: ListEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() list: UpdateListDto,
  ) {
    const updatedList = await this.listService.update(id, list);

    if (updatedList) return this.serialize(updatedList);
    else throw new UnprocessableEntityException();
  }

  @Delete(':id/dislike')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'List disliked.',
  })
  async dislike(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const list = await this.listService.dislike(req.currentUser.id, id);

    if (!list) throw new UnprocessableEntityException();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'List deleted.',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const list = await this.listService.delete(id);

    if (!list) throw new UnprocessableEntityException();
  }

  private serialize(list: List, likedByUser?: boolean) {
    return new ListEntity(list, likedByUser);
  }

  private serializeUser(user: User) {
    return new UserEntity(user);
  }
}
