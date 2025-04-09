import { USER_Role } from './user.constants';

export type Tuser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: keyof typeof USER_Role;
};

export type TUserRole = keyof typeof USER_Role;
