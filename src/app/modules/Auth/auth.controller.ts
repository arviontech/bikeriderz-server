import catchAsync from '../../Utills/catchAsync';
import sendResponse from '../../Utills/sendResponse';
import config from '../../config';
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
  const { accessToken, refereshToken, userData } = result;

  res.cookie('refreshToken', refereshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
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
