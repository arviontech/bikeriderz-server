import catchAsync from '../../Utills/catchAsync';
import sendResponse from '../../Utills/sendResponse';

import { AuthServices } from './auth.services';

const signUp = catchAsync(async (req, res) => {
  const result = await AuthServices.signUp(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const logIn = catchAsync(async (req, res) => {
  const result = await AuthServices.logIn(req.body);
  const { accessToken, refreshToken, userData } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    domain: 'bikeriderz.arviontech.online',
    secure: true,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User logged in successfully',
    token: accessToken,
    data: userData,
  });
});

export const AuthController = {
  signUp,
  logIn,
};
