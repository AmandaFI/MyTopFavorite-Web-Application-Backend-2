import { ListItem } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { MinimalistListEntity } from 'src/list/entities/minimalistList';

export class CompleteListItemEntity implements ListItem {
  id: number;
  title: string;
  externalApiIdentifier: string;
  details: string | null;
  imageUrl: string | null;
  rank: number;
  userComment: string;

  list: MinimalistListEntity;

  @Exclude() listId: number;
  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor({ list, ...data }: Partial<CompleteListItemEntity>) {
    Object.assign(this, data);
    if (list) this.list = new MinimalistListEntity(list);
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
