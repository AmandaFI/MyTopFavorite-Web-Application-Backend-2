import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

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
}
