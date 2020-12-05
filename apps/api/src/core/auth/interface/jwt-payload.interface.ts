import { UserRole } from '../../../enums/user-role.enum';

export interface JwtPayload {
  id: number;
  role:  UserRole;
}
