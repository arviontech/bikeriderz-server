import { NextFunction, Request, Response } from 'express';
import { TErrorSource } from '../Interface/error';
import { ZodError } from 'zod';
import handleZodError from '../Error/handleZodError';
import handleValidationError from '../Error/handleValidationError';
import handleCastError from '../Error/handleCastError';
import AppError from '../Error/AppError';
import handleDuplicateError from '../Error/handleDuplicateError';
import config from '../config';

const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // eslint-disable-next-line prefer-const
  let statusCode = 500;
  // eslint-disable-next-line prefer-const
  let message = 'something went wrong';

  // eslint-disable-next-line prefer-const
  let errorMessages: TErrorSource = [
    {
      path: '',
      message: 'something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    if (statusCode === 401) {
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
      });
    }
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    successs: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
