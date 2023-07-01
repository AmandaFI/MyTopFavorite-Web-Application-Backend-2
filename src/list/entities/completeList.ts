import { Exclude, Expose, Type } from 'class-transformer';
import { Category, List, ListItem, User } from '@prisma/client';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { CompleteUserEntity } from 'src/user/entities/completeUser';
import { BasicListItemEntity } from 'src/list-item/entities/basicListItem';

export class CompleteListEntity implements List {
  id: number;
  draft: boolean;
  title: string;
  createdAt: Date;

  // category: CategoryEntity;
  // listItems: BasicListItemEntity[];
  // user: CompleteUserEntity;

  category: Category;
  listItems: ListItem[];
  user: User;

  @Exclude() updatedAt: Date;
  @Exclude() categoryId: number;
  @Exclude() userId: number;
  @Exclude() likers: User[];

  @Expose()
  get likersCount(): number {
    return this.likers.length;
  }

  constructor(partial: Partial<CompleteListEntity>) {
    Object.assign(this, partial);
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
