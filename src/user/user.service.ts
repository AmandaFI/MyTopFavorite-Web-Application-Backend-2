import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { connect } from 'http2';
import { PaginationDto } from './dto/pagination.dto';
import * as bcrypt from 'bcrypt';

// https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#filter-conditions-and-operators
// https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  DEFAULT_PER_PAGE = 3;
  MAX_PER_PAGE = 100;
  SALT_OR_ROUNDS = 10;

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

  async authenticate(credentials: Pick<User, 'email' | 'password'>) {
    const user = await this.prisma.user.findFirst({
      where: { email: credentials.email },
      include: { followedUsers: true, followers: true, lists: true },
    });

    if (user) {
      if (await bcrypt.compare(credentials.password, user.password))
        return user;
    }
    return false;
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

  //https://docs.nestjs.com/security/encryption-and-hashing
  async create({ password, ...data }: CreateUserDto) {
    const hash = await bcrypt.hash(password, this.SALT_OR_ROUNDS);
    return this.prisma.user.create({
      data: { ...data, password: hash },
    });
  }

  update(id: number, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: { ...user },
      include: { followedUsers: true, followers: true, lists: true },
    });
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

  async followedUsersLists(
    loggedUserId: number,
    page = 1,
    perPage = this.DEFAULT_PER_PAGE,
  ) {
    if (perPage !== this.DEFAULT_PER_PAGE) {
      perPage = this.pagination(perPage);
    }

    const user = await this.find(loggedUserId, false, true, false);

    if (user) {
      return await Promise.all(
        user?.followedUsers.map(async (followedUser) => {
          const userLists = await this.prisma.user.findFirst({
            where: { id: followedUser.id },
            include: {
              lists: {
                skip: perPage * (page - 1),
                take: perPage,
                where: { draft: false },
                orderBy: { createdAt: 'desc' },
                include: {
                  category: true,
                  user: true,
                  items: true,
                  likers: true,
                },
              },
            },
          });
          return userLists?.lists;
        }),
      );
    }
  }

  private pagination(perPageParam: number) {
    const perPage =
      perPageParam < this.MAX_PER_PAGE ? perPageParam : this.MAX_PER_PAGE;

    return perPage;
  }
}
