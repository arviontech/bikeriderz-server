import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';
import { User } from '../User/user.model';
import { Bike } from '../Bike/bike.model';

const bookingSchema = new Schema<TBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  bikeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: Bike,
  },
  startTime: {
    type: String,
    required: true,
  },
  returnTime: {
    type: String,
    default: null,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  advancedPayment: {
    type: Number,
    default: 0,
  },
});

export const Booking = model<TBooking>('Booking', bookingSchema);
