import { ApiProperty } from '@nestjs/swagger';
import { ListItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ListEntity } from 'src/list/entities/list.entity';

export class ListItemEntity implements ListItem {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty() externalApiIdentifier: string;
  @ApiProperty() details: string | null;
  @ApiProperty() imageUrl: string | null;
  @ApiProperty() rank: number;
  @ApiProperty() userComment: string;

  @ApiProperty({ type: () => ListEntity })
  @Expose({ groups: ['completeListItem'] })
  list: ListEntity;

  @Exclude() listId: number;
  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor({ list, ...data }: Partial<ListItemEntity>) {
    Object.assign(this, data);
    if (list) this.list = new ListEntity(list);
  }
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
