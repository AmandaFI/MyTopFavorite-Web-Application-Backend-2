import { Exclude, Expose, Type } from 'class-transformer';
import { Category, List, User } from '@prisma/client';
import { ListService } from '../list.service';

export class CompleteListEntity implements List {
  id: number;
  draft: boolean;
  title: string;
  createdAt: Date;
  category: Category; // ver como serializar
  listItems: ListService[]; // ver como serializar
  user: User; // serializar da forma completa
  @Exclude() updatedAt: Date;
  @Exclude() categoryId: number;
  @Exclude() userId: number;
  @Exclude() likers: User[];
  // @Exclude() category: Category;

  @Expose()
  get likersCount(): number {
    return this.likers.length;
  }

  // @Expose()
  // get category(): number {
  //   return {category.id, category.name}
  // }

  constructor(partial: Partial<CompleteListEntity>) {
    Object.assign(this, partial);
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
