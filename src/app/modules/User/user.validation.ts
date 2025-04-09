import { z } from 'zod';
import { USER_Role } from './user.constants';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .min(1, 'Email is required'),
    password: z
      .string({ invalid_type_error: 'password must be string' })
      .min(1, 'Password is required')
      .max(20, { message: 'password can not be more than 20 characters' }), // You can add more constraints as needed
    phone: z.string().min(1, 'Phone number is required'),
    nidCardNo: z.string().min(1, 'NID Card number is required'),
    address: z.string().optional(),
    role: z.nativeEnum(USER_Role, {
      message: 'Role must be either admin or user',
    }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    nidCardNo: z.string().optional(),
    // role: z
    //   .nativeEnum(USER_Role, {
    //     message: 'Role must be either admin or user',
    //   })
    //   .optional(),
  }),
});

export { createUserValidationSchema, updateUserValidationSchema };
