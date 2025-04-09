import htttpStatus from 'http-status';

import AppError from '../Error/AppError';
import catchAsync from '../Utills/catchAsync';
export const parseBodyForFormData = catchAsync(async (req, res, next) => {
  if (!req.body.data) {
    throw new AppError(
      htttpStatus.BAD_REQUEST,
      'Please provide data in the body under data key',
    );
  }
  req.body = JSON.parse(req.body.data);
  next();
});
