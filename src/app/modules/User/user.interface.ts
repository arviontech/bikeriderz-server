import { Model } from 'mongoose';
import { USER_Role } from './user.constants';

export type Tuser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  nidCardNo: string;
  profileImg?: string;
  role: keyof typeof USER_Role;
  isDeleted?: boolean;
  passwordChangedAt?: Date;
};

export type TUserRole = keyof typeof USER_Role;

export interface UserModel extends Model<Tuser> {
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
