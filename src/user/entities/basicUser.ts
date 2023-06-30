import { List, User } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserService } from '../user.service';

//https://docs.nestjs.com/techniques/serialization

export class BasicUserEntity implements User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;

  @Exclude() password: string;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<BasicUserEntity>) {
    Object.assign(this, partial);
  }
}
