import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

//https://docs.nestjs.com/techniques/serialization

export class UserEntity implements User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;

  //   @Expose()
  //   get followersCount(): number {}
  //   @Expose()
  //   get followedUsersCount(): number {}
  //   @Expose()
  //   get listCount(): number {}

  @Exclude() password: string;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
