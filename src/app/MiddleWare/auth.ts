import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../Utills/catchAsync';
import { NextFunction, Request, Response } from 'express';

import { User } from '../modules/User/user.model';
import { TUserRole } from '../modules/User/user.interface';
import AppError from '../Error/AppError';
import httpStatus from 'http-status';
import { config } from '../config';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(401, 'You have no access to this route');
    }
    //("Bearer token")
    const token = accessToken.split(' ')[1]; //Splits the accessToken string at each space character, resulting in an array with two elements: ["Bearer", "<token>"].

    let verfiedToken;
    try {
      verfiedToken = jwt.verify(
        token as string,
        config.jwt_access_secret as string,
      );
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const { role, email } = verfiedToken as JwtPayload;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (!requiredRoles.includes(role)) {
      throw new AppError(401, 'You have no access to this route');
    }

    req.user = verfiedToken as JwtPayload;
    next();
  });
};
