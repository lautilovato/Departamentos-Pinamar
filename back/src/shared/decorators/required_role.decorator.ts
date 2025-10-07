import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'required_roles';

export const RequiredRole = (...roles: string[]) =>
  SetMetadata(ROLE_KEY, roles);
