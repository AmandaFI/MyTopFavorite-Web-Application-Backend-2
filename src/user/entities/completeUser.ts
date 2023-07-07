import { List, User } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CompleteListEntity } from 'src/list/entities/completeList';

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

  // @Transform(({ value }) => value.length)
  // followers: User[];

  // @Transform(({ value }) => value.length)
  // followedUsers: User[];

  // @Transform(({ value }) => value.length)
  // lists: List[];

  constructor({ lists, ...data }: Partial<CompleteUserEntity>) {
    Object.assign(this, data);
    if (lists) this.lists = lists.map((list) => new CompleteListEntity(list));
  }
}
