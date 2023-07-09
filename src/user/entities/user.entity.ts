import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { List, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ListEntity } from 'src/list/entities/list.entity';

//https://docs.nestjs.com/techniques/serialization

export class UserEntity implements User {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() createdAt: Date;

  @Exclude() followers: User[];
  @Exclude() followedUsers: User[];
  @Exclude() lists: List[];
  @Exclude() password: string;
  @Exclude() updatedAt: Date;

  @ApiPropertyOptional()
  @Expose({ groups: ['completeUser'] })
  get followersCount(): number {
    return this.followers.length;
  }

  @ApiPropertyOptional()
  @Expose({ groups: ['completeUser'] })
  get followedUsersCount(): number {
    return this.followedUsers.length;
  }

  @ApiPropertyOptional()
  @Expose({ groups: ['completeUser'] })
  get listCount(): number {
    return this.lists.length;
  }

  constructor({ lists, ...data }: Partial<UserEntity>) {
    Object.assign(this, data);
    if (lists) this.lists = lists.map((list) => new ListEntity(list));
  }
}

// https://docs.nestjs.com/techniques/serialization#pass-options
// https://www.npmjs.com/package/@nestjs/class-transformer#using-groups-to-control-excluded-properties
