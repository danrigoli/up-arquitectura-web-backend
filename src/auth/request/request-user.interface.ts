import { Request } from 'express';
import { AuthUser } from './auth-user';

export interface RequestUser extends Request {
  user: AuthUser;
}
