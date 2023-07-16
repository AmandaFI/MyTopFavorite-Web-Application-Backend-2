import { Exclude, Expose } from 'class-transformer';
import { List, User } from '@prisma/client';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ListItemEntity } from 'src/list-item/entities/listItem.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListEntity implements List {
  @ApiProperty() id: number;
  @ApiProperty() draft: boolean;
  @ApiProperty() title: string;
  @ApiProperty() createdAt: Date;

  @ApiProperty({ type: () => CategoryEntity }) category: CategoryEntity;

  @Exclude() updatedAt: Date;
  @Exclude() categoryId: number;
  @Exclude() userId: number;
  @Exclude() likers: User[];

  @ApiPropertyOptional({ type: () => [ListItemEntity] })
  @Expose({ groups: ['completeList'] })
  items: ListItemEntity[];

  @ApiPropertyOptional({ type: () => UserEntity })
  @Expose({ groups: ['completeList'] })
  user: UserEntity;

  @ApiPropertyOptional()
  @Expose({ groups: ['completeList'] })
  likedByCurrentUser?: boolean;

  @ApiPropertyOptional()
  @Expose({ groups: ['basicList', 'completeList'] })
  get likersCount(): number | undefined {
    return this.likers.length;
  }

  @ApiPropertyOptional()
  @Expose({ groups: ['basicList'] })
  get itemsCount(): number {
    return this.items ? this.items.length : 0;
  }

  constructor(
    { user, category, items, ...data }: Partial<ListEntity>,
    likedByCurrentUser?: boolean,
  ) {
    Object.assign(this, data);
    if (user) this.user = new UserEntity(user);
    if (category) this.category = new CategoryEntity(category);
    if (items) this.items = items.map((item) => new ListItemEntity(item));
    if (likedByCurrentUser !== undefined)
      this.likedByCurrentUser = likedByCurrentUser;
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
// https://docs.nestjs.com/techniques/serialization#pass-options
// https://www.npmjs.com/package/@nestjs/class-transformer#using-groups-to-control-excluded-properties
