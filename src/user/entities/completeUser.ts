import { List, User } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

//https://docs.nestjs.com/techniques/serialization

export class CompleteUserEntity implements User {
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

  constructor(partial: Partial<CompleteUserEntity>) {
    Object.assign(this, partial);
  }
}
