import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { connect } from 'http2';
import { PaginationDto } from './dto/pagination.dto';

// https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#filter-conditions-and-operators
// https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  DEFAULT_PER_PAGE = 3;
  MAX_PER_PAGE = 100;

  find(
    id: User['id'],
    followers: boolean = false,
    followedUsers: boolean = false,
    lists: boolean = false,
  ) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { followers, followedUsers, lists },
    });
  }

  authenticate(credentials: Pick<User, 'email' | 'password'>) {
    return this.prisma.user.findFirst({
      where: { email: credentials.email, password: credentials.password },
    });
  }

  findAll(
    followers: boolean = false,
    followedUsers: boolean = false,
    lists: boolean = false,
  ) {
    return this.prisma.user.findMany({
      include: { followers, followedUsers, lists },
    });
  }

  create(user: CreateUserDto) {
    return this.prisma.user.create({
      data: { ...user },
    });
  }

  update(id: number, user: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: { ...user } });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  follow(current_user_id: number, user_to_be_followed_id: number) {
    return this.prisma.user.update({
      where: { id: current_user_id },
      data: { followedUsers: { connect: { id: user_to_be_followed_id } } },
    });
  }

  unfollow(current_user_id: number, user_to_be_unfollowed_id: number) {
    return this.prisma.user.update({
      where: { id: current_user_id },
      data: { followedUsers: { disconnect: { id: user_to_be_unfollowed_id } } },
    });
  }

  checkFollowing(loggedUserId: number, followedUserId: number) {
    return this.prisma.user.findFirst({
      where: {
        id: followedUserId,
        followers: { some: { id: loggedUserId } },
      },
    });
  }

  findUsersByName(partialName: string) {
    return this.prisma.user.findMany({
      where: { name: { contains: partialName } },
    });
  }

  // RESOLVER PROBLEMA DE SERIALIZAR O USER
  followedUsersLists(
    loggedUserId: number,
    page = 1,
    perPage = this.DEFAULT_PER_PAGE,
  ) {
    if (perPage !== this.DEFAULT_PER_PAGE) {
      perPage = this.pagination(perPage);
    }

    // return this.prisma.user.findFirst({
    //   where: { id: loggedUserId },
    //   include: {
    //     lists: {
    //       skip: perPage * (page - 1),
    //       take: perPage,
    //       where: { draft: false },
    //       orderBy: { createdAt: 'desc' },
    //       include: {
    //         category: { select: { id: true, name: true } },
    //         user: true,
    //         listItems: {
    //           select: {
    //             id: true,
    //             externalApiIdentifier: true,
    //             imageUrl: true,
    //             details: true,
    //             rank: true,
    //             userComment: true,
    //           },
    //         },
    //         likers: true,
    //       },
    //     },
    //   },
    // });

    return this.prisma.user.findFirst({
      where: { id: loggedUserId },
      include: {
        lists: {
          skip: perPage * (page - 1),
          take: perPage,
          where: { draft: false },
          orderBy: { createdAt: 'desc' },
          include: {
            category: true,
            user: true,
            listItems: true,
            likers: true,
          },
        },
      },
    });
  }

  private pagination(perPageParam: number) {
    const perPage =
      perPageParam < this.MAX_PER_PAGE ? perPageParam : this.MAX_PER_PAGE;

    return perPage;
  }
}
