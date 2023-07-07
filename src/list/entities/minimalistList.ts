import { Exclude, Expose } from 'class-transformer';
import { List, ListItem, User } from '@prisma/client';
import { CategoryEntity } from 'src/category/entities/category.entity';

export class MinimalistListEntity implements List {
  id: number;
  draft: boolean;
  title: string;
  createdAt: Date;

  category: CategoryEntity;

  @Exclude() listItems: ListItem[];
  @Exclude() updatedAt: Date;
  @Exclude() categoryId: number;
  @Exclude() userId: number;
  @Exclude() likers: User[];

  constructor({ category, ...data }: Partial<MinimalistListEntity>) {
    Object.assign(this, data);
    if (category) this.category = new CategoryEntity(category);
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
