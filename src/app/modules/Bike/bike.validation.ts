import { z } from 'zod';

const createBikeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    image: z.array(z.string().url(), {
      required_error: 'Product images are required',
    }),
    description: z.string().min(1, 'Description is required'),
    pricePerHour: z.number().min(0, 'Price per hour must be a positive number'),
    isAvailable: z.boolean().optional(), // Optional since it defaults to true
    cc: z.number().min(1, 'CC must be a positive number'),
    mileage: z.number().min(1, 'Mileage must be a positive number'),
    topSpeed: z.number().min(1, 'Top speed must be a positive number'),
    power: z.number().min(1, 'Power must be a positive number'),
    tyreType: z.string().min(1, 'Tyre Type is required'),
    year: z.number().min(1900, 'Year must be a valid year'),
    model: z.string().min(1, 'Model is required'),
    brand: z.string().min(1, 'Brand is required'),
    madeIn: z.string().min(1, 'Made in is required'),
    engineType: z.string().min(1, 'Engine Type is required'),
    fuelSupply: z.string().min(1, 'Fuel Supply is required'),
    engineCooling: z.string().min(1, 'Engine Cooling is required'),
    noOfCylinders: z
      .number()
      .min(1, 'Number of cylinders must be a positive number'),
    startingMethod: z.string().min(1, 'Starting Method is required'),
    fuelTankCapacity: z
      .number()
      .min(1, 'Fuel tank capacity must be a positive number'),
    brakeType: z.string().min(1, 'Brake Type is required'),
    abs: z.string().min(1, 'ABS is required'),
    batteryType: z.string().min(1, 'Battery Type is required'),
    batteryVoltage: z.string().min(1, 'Battery Voltage is required'),
    headLamp: z.string().min(1, 'Head Lamp is required'),
    indicator: z.string().min(1, 'Indicator is required'),
  }),
});

const updateBikeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    pricePerHour: z
      .number()
      .min(0, 'Price per hour must be a positive number')
      .optional(),
    cc: z.number().min(1, 'CC must be a positive number').optional(),
    year: z.number().min(1900, 'Year must be a valid year').optional(),
    model: z.string().min(1, 'Model is required').optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
  }),
});

export const BikeValidation = {
  createBikeValidationSchema,
  updateBikeValidationSchema,
};
