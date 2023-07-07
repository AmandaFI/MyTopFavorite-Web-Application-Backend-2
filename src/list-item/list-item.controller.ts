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
} from '@nestjs/common';
import { AuthenticateUserGuard } from 'src/authorization/guards/authenticate.guard';
import { ListItemService } from './list-item.service';
import { CreateListItemDto } from './dto/create-listItem.dto';
import { UpdateListItemDto } from './dto/update-listItem.dto';
import { ListItem } from '@prisma/client';
import { BasicListItemEntity } from './entities/basicListItem';
import { CompleteListItemEntity } from './entities/completeListItem';

// DECIDIR SERIALIZADORES

@Controller('api/list_items')
@UseGuards(AuthenticateUserGuard)
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const listItem = await this.listItemService.find(id);

    if (listItem) return this.completeSerializer(listItem);
    else throw new NotFoundException();
  }

  @Get()
  async index(@Query('list_id', ParseIntPipe) listId: number) {
    const listItems = await this.listItemService.findMany(listId);

    if (listItems)
      return listItems.map((listItem) => this.basicSerializer(listItem));
    else throw new NotFoundException();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() listItem: CreateListItemDto) {
    const createdListItem = await this.listItemService.create(listItem);

    if (createdListItem) return this.basicSerializer(createdListItem);
    else throw new UnprocessableEntityException();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() listItem: UpdateListItemDto,
  ) {
    const updatedListItem = await this.listItemService.update(id, listItem);

    if (updatedListItem) return this.basicSerializer(updatedListItem);
    else throw new UnprocessableEntityException();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const listItem = await this.listItemService.delete(id);

    if (!listItem) throw new UnprocessableEntityException();
  }

  private basicSerializer(listItem: ListItem) {
    return new BasicListItemEntity(listItem);
  }

  private completeSerializer(listItem: ListItem) {
    return new CompleteListItemEntity(listItem);
  }
}
