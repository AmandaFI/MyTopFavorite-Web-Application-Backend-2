import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  DEFAULT_PER_PAGE = 3;
  MAX_PER_PAGE = 100;

  find(
    id: number,
    category: boolean = false,
    listItems: boolean = false,
    user: boolean = false,
  ) {
    return this.prisma.list.findUnique({
      where: { id },
      include: {
        category,
        listItems,
        user,
      },
    });
  }

  findMany(
    id: number,
    category: boolean = false,
    listItems: boolean = false,
    user: boolean = false,
  ) {
    return this.prisma.list.findMany({
      where: { id },
      include: {
        category,
        listItems,
        user,
      },
    });

    // return this.prisma.list.findMany({
    //   where: { id },
    //   include: {
    //     category: { select: { id: true, name: true } },
    //     listItems,
    //     user,
    //   },
    // });
  }

  create(id: number, list: CreateListDto) {
    const { categoryId, ...props } = list;
    return this.prisma.list.create({
      data: {
        ...props,
        user: { connect: { id } },
        category: { connect: { id: categoryId } },
      },
    });
  }

  update(id: number, list: UpdateListDto) {
    return this.prisma.list.update({ where: { id }, data: { ...list } });
  }

  delete(id: number) {
    return this.prisma.list.delete({ where: { id } });
  }

  like(loggedUserId: number, listId: number) {
    return this.prisma.list.update({
      where: { id: listId },
      data: { likers: { connect: { id: loggedUserId } } },
    });
  }

  dislike(loggedUserId: number, listId: number) {
    return this.prisma.list.update({
      where: { id: listId },
      data: { likers: { disconnect: { id: loggedUserId } } },
    });
  }

  draftLists(userId: number) {
    return this.prisma.list.findMany({
      where: { userId, draft: true },
      include: { category: true },
    });
  }

  publishedLists(
    userId: number,
    paginationPage: number | undefined,
    perPage = this.DEFAULT_PER_PAGE,
  ) {
    const page = paginationPage !== undefined ? paginationPage : 1;
    if (perPage !== this.DEFAULT_PER_PAGE) {
      perPage = this.pagination(perPage);
    }

    return this.prisma.list.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: { userId, draft: false },
      include: { category: true, listItems: paginationPage !== undefined },
    });
  }

  private pagination(perPageParam: number) {
    const perPage =
      perPageParam < this.MAX_PER_PAGE ? perPageParam : this.MAX_PER_PAGE;

    return perPage;
  }
}
