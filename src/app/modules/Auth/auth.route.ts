import express from 'express';
import validateRequest from '../../MiddleWare/validateRequest';
import { createUserValidationSchema } from '../User/user.validation';
import { AuthController } from './auth.controller';
import loginValidationSchema from './auth.validation';
const router = express.Router();

router.post(
  '/signup',
  validateRequest(createUserValidationSchema),
  AuthController.signUp,
);
router.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthController.logIn,
);

export const AuthRoutes = router;
