import { Exclude, Expose, Type } from 'class-transformer';
import { Category, List, ListItem, User } from '@prisma/client';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { BasicListItemEntity } from 'src/list-item/entities/basicListItem';
import { BasicUserEntity } from 'src/user/entities/basicUser';

export class CompleteListEntity implements List {
  id: number;
  draft: boolean;
  title: string;
  createdAt: Date;

  category: CategoryEntity;
  listItems: BasicListItemEntity[];
  user: BasicUserEntity;

  likedByCurrentUser?: boolean;

  @Exclude() updatedAt: Date;
  @Exclude() categoryId: number;
  @Exclude() userId: number;
  @Exclude() likers: User[];

  @Expose()
  get likersCount(): number | undefined {
    return this.likers.length;
  }

  constructor(
    { user, category, listItems, ...data }: Partial<CompleteListEntity>,
    likedByCurrentUser?: boolean,
  ) {
    Object.assign(this, data);
    if (user) this.user = new BasicUserEntity(user);
    if (category) this.category = new CategoryEntity(category);
    if (listItems)
      this.listItems = listItems.map((item) => new BasicListItemEntity(item));
    if (likedByCurrentUser !== undefined)
      this.likedByCurrentUser = likedByCurrentUser;
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
