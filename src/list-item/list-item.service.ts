import { Injectable } from '@nestjs/common';
import { ListItem, List } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateListItemDto } from './dto/create-listItem.dto';
import { UpdateListItemDto } from './dto/update-listItem.dto';

@Injectable()
export class ListItemService {
  constructor(private readonly prisma: PrismaService) {}

  find(id: ListItem['id']) {
    return this.prisma.listItem.findUnique({
      where: { id },
      include: { list: { include: { category: true } } },
    });
  }

  findMany(listId: List['id'], list: boolean = false) {
    return this.prisma.listItem.findMany({
      where: { listId },
      include: { list },
    });
  }

  create(listItem: CreateListItemDto) {
    const { listId, ...props } = listItem;
    return this.prisma.listItem.create({
      data: { ...props, list: { connect: { id: listId } } },
    });
  }

  update(id: number, listItem: UpdateListItemDto) {
    return this.prisma.listItem.update({
      where: { id },
      data: { ...listItem },
    });
  }

  delete(id: number) {
    return this.prisma.listItem.delete({ where: { id } });
  }
}
