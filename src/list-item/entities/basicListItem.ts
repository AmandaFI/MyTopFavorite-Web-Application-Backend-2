import { ListItem } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class BasicListItemEntity implements ListItem {
  id: number;
  title: string;
  externalApiIdentifier: string;
  details: string | null;
  imageUrl: string | null;
  rank: number;
  userComment: string;

  @Exclude() listId: number;
  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<BasicListItemEntity>) {
    Object.assign(this, partial);
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
