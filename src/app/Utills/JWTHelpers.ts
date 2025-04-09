import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { USER_Role } from '../modules/User/user.constants';

interface JwtPayload {
  id: string;
  email: string;
  phone: string;
  role: keyof typeof USER_Role;
  profileImg?: string;
}

const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string | number,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
