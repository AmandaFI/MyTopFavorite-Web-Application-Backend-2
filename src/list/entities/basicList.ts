import { Exclude, Expose } from 'class-transformer';
import { List, ListItem, User } from '@prisma/client';
import { CategoryEntity } from 'src/category/entities/category.entity';

export class BasicListEntity implements List {
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

  @Expose()
  get likersCount(): number {
    return this.likers.length;
  }

  @Expose()
  get itemsCount(): number {
    return this.listItems.length;
  }

  constructor({ category, ...data }: Partial<BasicListEntity>) {
    Object.assign(this, data);
    if (category) this.category = new CategoryEntity(category);
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
