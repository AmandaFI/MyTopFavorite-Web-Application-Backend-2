import { List, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ListEntity } from 'src/list/entities/list.entity';

//https://docs.nestjs.com/techniques/serialization

export class UserEntity implements User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;

  @Exclude() followers: User[];
  @Exclude() followedUsers: User[];
  @Exclude() lists: List[];
  @Exclude() password: string;
  @Exclude() updatedAt: Date;

  @Expose({ groups: ['completeUser'] })
  get followersCount(): number {
    return this.followers.length;
  }
  @Expose({ groups: ['completeUser'] })
  get followedUsersCount(): number {
    return this.followedUsers.length;
  }
  @Expose({ groups: ['completeUser'] })
  get listCount(): number {
    return this.lists.length;
  }

  constructor({ lists, ...data }: Partial<UserEntity>) {
    Object.assign(this, data);
    if (lists) this.lists = lists.map((list) => new ListEntity(list));
  }
}
