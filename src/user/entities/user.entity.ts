import { List, User } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserService } from '../user.service';

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

  @Expose()
  get followersCount(): number {
    return this.followers.length;
  }
  @Expose()
  get followedUsersCount(): number {
    return this.followedUsers.length;
  }
  @Expose()
  get listCount(): number {
    return this.lists.length;
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
