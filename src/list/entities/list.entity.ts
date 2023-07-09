import { Exclude, Expose } from 'class-transformer';
import { List, User } from '@prisma/client';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ListItemEntity } from 'src/list-item/entities/listItem.entity';

export class ListEntity implements List {
  id: number;
  draft: boolean;
  title: string;
  createdAt: Date;

  category: CategoryEntity;

  @Expose({ groups: ['completeList'] })
  listItems: ListItemEntity[];

  @Expose({ groups: ['completeList'] })
  user: UserEntity;

  @Expose({ groups: ['completeList'] })
  likedByCurrentUser?: boolean;

  @Exclude() updatedAt: Date;
  @Exclude() categoryId: number;
  @Exclude() userId: number;
  @Exclude() likers: User[];

  @Expose({ groups: ['basicList', 'completeList'] })
  get likersCount(): number | undefined {
    return this.likers.length;
  }

  @Expose({ groups: ['basicList'] })
  get itemsCount(): number {
    return this.listItems ? this.listItems.length : 0;
  }

  constructor(
    { user, category, listItems, ...data }: Partial<ListEntity>,
    likedByCurrentUser?: boolean,
  ) {
    Object.assign(this, data);
    if (user) this.user = new UserEntity(user);
    if (category) this.category = new CategoryEntity(category);
    if (listItems)
      this.listItems = listItems.map((item) => new ListItemEntity(item));
    if (likedByCurrentUser !== undefined)
      this.likedByCurrentUser = likedByCurrentUser;
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
// https://docs.nestjs.com/techniques/serialization#pass-options
// https://www.npmjs.com/package/@nestjs/class-transformer#using-groups-to-control-excluded-properties
