import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

export interface FindListIncludeRelationsInterface {
  category?: boolean;
  items?: boolean;
  user?: boolean;
  likers?: boolean;
}

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  DEFAULT_PER_PAGE = 3;
  MAX_PER_PAGE = 100;

  find(
    id: number,
    {
      category = false,
      items = false,
      user = false,
      likers = false,
    }: FindListIncludeRelationsInterface = {},
  ) {
    return this.prisma.list.findUnique({
      where: { id },
      include: { category, items, user, likers },
    });
  }

  findMany(
    id: number,
    {
      category = false,
      items = false,
      user = false,
      likers = false,
    }: FindListIncludeRelationsInterface = {},
  ) {
    return this.prisma.list.findMany({
      where: { id },
      include: {
        category,
        items,
        user,
        likers,
      },
    });
  }

  create(id: number, list: CreateListDto) {
    const { categoryId, ...props } = list;
    return this.prisma.list.create({
      data: {
        ...props,
        user: { connect: { id } },
        category: { connect: { id: categoryId } },
      },
      include: {
        likers: true,
        items: true,
        category: true,
      },
    });
  }

  update(id: number, list: UpdateListDto) {
    return this.prisma.list.update({
      where: { id },
      data: { ...list },
      include: {
        likers: true,
        items: true,
        category: true,
      },
    });
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
      include: {
        category: true,
        items: true,
        likers: true,
      },
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
      include: {
        category: true,
        items: true,
        likers: true,
      },
    });
  }

  checkLiker(listId: number, userId: number) {
    return this.prisma.list.findFirst({
      where: {
        id: listId,
        likers: { some: { id: userId } },
      },
    });
  }

  private pagination(perPageParam: number) {
    const perPage =
      perPageParam < this.MAX_PER_PAGE ? perPageParam : this.MAX_PER_PAGE;

    return perPage;
  }
}
