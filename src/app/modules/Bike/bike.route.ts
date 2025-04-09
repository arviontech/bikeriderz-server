import express from 'express';
import { auth } from '../../MiddleWare/auth';
import { USER_Role } from '../User/user.constants';
import { BikeController } from './bike.controller';
import validateRequest from '../../MiddleWare/validateRequest';
import { BikeValidation } from './bike.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_Role.admin),
  validateRequest(BikeValidation.createBikeValidationSchema),
  BikeController.createBike,
);
router.get('/', BikeController.getAllBike);
router.get('/:id', BikeController.getSingleBike);

router.put(
  '/:id',
  auth(USER_Role.admin),
  validateRequest(BikeValidation.updateBikeValidationSchema),
  BikeController.updateBike,
);
router.delete('/:id', auth(USER_Role.admin), BikeController.deleteBike);
export const BikeRoutes = router;
