import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { SessionController } from './session/session.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { ListService } from './list/list.service';
import { ListItemService } from './list-item/list-item.service';
import { ListItemController } from './list-item/list-item.controller';
import { ListController } from './list/list.controller';

@Module({
  imports: [],
  controllers: [AppController, CategoryController, SessionController, UserController, ListItemController, ListController],
  providers: [AppService, PrismaService, CategoryService, UserService, ListService, ListItemService],
})
export class AppModule {}
