import { Request } from 'express';
import { User, UserRole } from '../../infrastructure/database/entities/User.entity';

export interface RequestWithUser extends Request {
    user: User;
}
export { UserRole } from '../../infrastructure/database/entities/User.entity';