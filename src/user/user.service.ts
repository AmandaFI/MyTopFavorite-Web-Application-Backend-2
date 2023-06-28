import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { connect } from 'http2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  find(id: User['id']) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  authenticate(credentials: Pick<User, 'email' | 'password'>) {
    return this.prisma.user.findFirst({
      where: { email: credentials.email, password: credentials.password },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  create(user: CreateUserDto) {
    return this.prisma.user.create({ data: { ...user } });
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
}
