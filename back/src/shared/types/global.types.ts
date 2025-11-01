import { Request } from 'express';
import { User, UserRole } from '../../infrastructure/database/entities/User';

export type RequestWithUser = Request & {
  user: User;
};