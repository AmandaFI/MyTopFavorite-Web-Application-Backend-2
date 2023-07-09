import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  UnprocessableEntityException,
  UseGuards,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { AuthenticateUserGuard } from 'src/authorization/guards/authenticate.guard';
import { ListItemService } from './list-item.service';
import { CreateListItemDto } from './dto/create-listItem.dto';
import { UpdateListItemDto } from './dto/update-listItem.dto';
import { ListItem } from '@prisma/client';
import { ListItemEntity } from './entities/listItem.entity';

@Controller('api/list_items')
@UseGuards(AuthenticateUserGuard)
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}

  @Get(':id')
  @SerializeOptions({
    groups: ['completeListItem'],
  })
  async show(@Param('id', ParseIntPipe) id: number) {
    const listItem = await this.listItemService.find(id);

    if (listItem) return this.serialize(listItem);
    else throw new NotFoundException();
  }

  @Get()
  async index(@Query('list_id', ParseIntPipe) listId: number) {
    const listItems = await this.listItemService.findMany(listId);

    if (listItems) return listItems.map((listItem) => this.serialize(listItem));
    else throw new NotFoundException();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() listItem: CreateListItemDto) {
    const createdListItem = await this.listItemService.create(listItem);

    if (createdListItem) return this.serialize(createdListItem);
    else throw new UnprocessableEntityException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() listItem: UpdateListItemDto,
  ) {
    const updatedListItem = await this.listItemService.update(id, listItem);

    if (updatedListItem) return this.serialize(updatedListItem);
    else throw new UnprocessableEntityException();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const listItem = await this.listItemService.delete(id);

    if (!listItem) throw new UnprocessableEntityException();
  }

  private serialize(listItem: ListItem) {
    return new ListItemEntity(listItem);
  }
}
