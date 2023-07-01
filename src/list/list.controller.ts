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
  UnsupportedMediaTypeException,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticateUserGuard,
  AuthenticatedRequest,
} from 'src/authorization/guards/authenticate.guard';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

// DECIDIR SERIALIZADORES

@Controller('api/lists')
@UseGuards(AuthenticateUserGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get('draft_lists')
  async draftLists(@Req() req: AuthenticatedRequest) {
    const lists = await this.listService.draftLists(req.currentUser.id);

    if (lists) return lists;
    else throw new NotFoundException();
  }

  @Get(':id/published_lists')
  async publishedLists(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') pageParam?: string,
    @Query('per_page') perPageParam?: string,
  ) {
    let page = pageParam ? +pageParam : undefined;
    let perPage = perPageParam ? +perPageParam : undefined;

    const lists = await this.listService.publishedLists(id, page, perPage);

    if (lists) return lists;
    else throw new NotFoundException();
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const list = await this.listService.find(id, true, true, true);

    if (list) return list;
    else throw new NotFoundException();
  }

  @Get()
  async index(@Req() req: AuthenticatedRequest) {
    const lists = await this.listService.findMany(
      req.currentUser.id,
      true,
      false,
      false,
    );

    if (lists) return lists;
    else throw new NotFoundException();
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.CREATED)
  async like(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const list = await this.listService.like(req.currentUser.id, id);

    if (list) return req.currentUser;
    else throw new UnprocessableEntityException();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: AuthenticatedRequest, @Body() list: CreateListDto) {
    const createdList = await this.listService.create(req.currentUser.id, list);

    if (createdList) return createdList;
    else throw new UnprocessableEntityException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() list: UpdateListDto,
  ) {
    const updatedList = await this.listService.update(id, list);

    if (updatedList) return updatedList;
    else throw new UnprocessableEntityException();
  }

  @Delete(':id/dislike')
  @HttpCode(HttpStatus.NO_CONTENT)
  async dislike(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const list = await this.listService.dislike(req.currentUser.id, id);

    if (!list) throw new UnprocessableEntityException();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const list = await this.listService.delete(id);

    if (!list) throw new UnprocessableEntityException();
  }
}
