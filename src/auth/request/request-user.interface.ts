import { Request } from 'express';
import { AuthUser } from '../dto/response/auth-user';

export interface RequestUser extends Request {
  user: AuthUser;
}
