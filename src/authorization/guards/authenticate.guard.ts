import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

// User logado ficará guardado no request
export interface AuthenticatedRequest extends Request {
  currentUser: User;
}

@Injectable()
export class AuthenticateUserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as AuthenticatedRequest;

    if (req.session.currentUserId === undefined) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.find(req.session.currentUserId);
    if (!user) throw NotFoundException;

    req.currentUser = user;

    return true;
  }
}
