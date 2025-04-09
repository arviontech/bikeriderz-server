import { config } from '../../config';
import { jwtHelpers } from '../../Utills/JWTHelpers';
import { Tuser } from '../User/user.interface';
import { User, isPasswordMatched } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import { Secret } from 'jsonwebtoken';
const signUp = async (payload: Tuser) => {
  //user existence check
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw new Error('User already exists');
  }

  //set user role
  // payload.role = USER_Role.user;

  //create user
  const newUser = await User.create(payload);

  return newUser;
};

const logIn = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new Error('user not found');
  }
  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password,
  );
  if (!passwordMatch) {
    throw new Error('Password not matched');
  }

  const JwtPayload = {
    email: user.email,
    role: user.role,
    phone: user.phone,
    profileImg: user.profileImg,
    id: user._id,
  };

  const accessToken = jwtHelpers.generateToken(
    JwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expire_in as string,
  );
  const refreshToken = jwtHelpers.generateToken(
    JwtPayload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expire_in as string,
  );

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    profileImg: user.profileImg,
    role: user.role,
  };

  return { accessToken, refreshToken, userData };
};

export const AuthServices = {
  signUp,
  logIn,
};
