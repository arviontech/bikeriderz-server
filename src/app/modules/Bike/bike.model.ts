import { Schema, model } from 'mongoose';
import { TBike } from './bike.interface';

const bikeSchema = new Schema<TBike>(
  {
    name: { type: String, required: true },
    image: { type: [String], required: [true, 'Product image is required'] },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    cc: { type: Number, required: true },
    mileage: { type: Number, required: true },
    topSpeed: { type: Number, required: true },
    power: { type: Number, required: true },
    tyreType: { type: String, required: true },
    year: { type: Number, required: true },
    model: { type: String, required: true },
    brand: { type: String, required: true },
    madeIn: { type: String, required: true },
    engineType: { type: String, required: true },
    fuelSupply: { type: String, required: true },
    engineCooling: { type: String, required: true },
    noOfCylinders: { type: Number, required: true },
    startingMethod: { type: String, required: true },
    fuelTankCapacity: { type: Number, required: true },
    brakeType: { type: String, required: true },
    abs: { type: String, required: true },
    batteryType: { type: String, required: true },
    batteryVoltage: { type: String, required: true },
    headLamp: { type: String, required: true },
    indicator: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Bike = model<TBike>('Bike', bikeSchema);
