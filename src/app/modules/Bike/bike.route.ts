/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { auth } from '../../MiddleWare/auth';
import { USER_Role } from '../User/user.constants';
import { BikeController } from './bike.controller';
import validateRequest from '../../MiddleWare/validateRequest';
import { BikeValidation } from './bike.validation';
import { uploadMultipleImages } from '../../config/multer.config';
import { validateFileRequest } from '../../MiddleWare/validateUploadedFile';
import { UploadedFilesArrayZodSchema } from '../../Utills/uploadedFileValidationSchema';
import { parseBodyForFormData } from '../../MiddleWare/ParseBodyForFormData';

const router = express.Router();

router.post(
  '/',
  auth(USER_Role.admin, USER_Role.super_admin),
  uploadMultipleImages([{ name: 'images', maxCount: 5 }]) as any,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(BikeValidation.createBikeValidationSchema),
  BikeController.createBike,
);
router.get('/', BikeController.getAllBike);
router.get('/:id', BikeController.getSingleBike);

router.put(
  '/:id',
  auth(USER_Role.admin, USER_Role.super_admin),
  uploadMultipleImages([{ name: 'images', maxCount: 5 }]) as any,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(BikeValidation.updateBikeValidationSchema),
  BikeController.updateBike,
);
router.delete('/:id', auth(USER_Role.admin), BikeController.deleteBike);
export const BikeRoutes = router;
