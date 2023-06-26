import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { SessionController } from './session/session.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [],
  controllers: [AppController, CategoryController, SessionController],
  providers: [AppService, PrismaService, CategoryService, UserService],
})
export class AppModule {}
