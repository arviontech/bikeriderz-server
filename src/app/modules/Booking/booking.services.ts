import mongoose from 'mongoose';
import { Bike } from '../Bike/bike.model';
import { User } from '../User/user.model';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';

const createRentalIntoDB = async (_id: string, payload: TBooking) => {
  const user = await User.findById(_id);
  if (!user) {
    throw new Error('User not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const bike = await Bike.findById({ _id: payload.bikeId });
    if (!bike) {
      throw new Error('Bike not found');
    }

    if (!bike.isAvailable) {
      throw new Error('Bike is not available for rental');
    }
    // Update bike's availability status
    bike.isAvailable = false;
    await bike.save({ session });

    payload.userId = user._id;

    const rental = await Booking.create([payload], { session });
    if (!rental.length) {
      throw new Error('Failed to create Rental');
    }

    await session.commitTransaction();
    await session.endSession();
    return rental;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateAsReturnBike = async (id: string) => {
  const rental = await Booking.findById(id);
  if (!rental) {
    throw new Error('Rental not found');
  }

  const bike = await Bike.findById(rental.bikeId);
  if (!bike) {
    throw new Error('Bike not found');
  }

  // Calculate the rental duration and total cost
  const startTime = new Date(rental.startTime); //JavaScript's Date constructor parses the string into a Date object,
  const returnTime = new Date(); // current time
  const durationInHours = Math.ceil(
    //Math.ceil() is used to round up to the nearest integer
    (returnTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 - 100), //converts milliseconds to hours.
  );
  const totalCost = durationInHours * bike.pricePerHour;

  // Update rental record
  rental.returnTime = returnTime.toISOString(); //converts the current time to an ISO string format ("2024-06-10T18:00:00.000Z").
  rental.totalCost = totalCost;
  rental.isReturned = true;
  await rental.save();

  // Update bike's availability status
  bike.isAvailable = true;
  await bike.save();

  return rental;
};

const getAllRentalsFromDB = async (query: Record<string, unknown>) => {
  const { brand, page, limit } = query;

  let brandQuery = {};

  // Apply brand filter if provided and not 'All Brands'
  if (brand && brand !== 'All Brands') {
    brandQuery = { 'bikeId.brand': brand }; // Reference the bike's brand field
  }

  // Pagination Logic
  const pageNumber: number = Number(page) || 1; // Default to page 1 if no page is provided
  const itemsPerPage: number = Number(limit) || 10;
  const skip: number = (pageNumber - 1) * itemsPerPage; // Calculate how many items to skip

  const booking = await Booking.find(brandQuery)
    .populate('bikeId')
    .populate('userId')
    .skip(skip)
    .limit(itemsPerPage); // Apply pagination

  // Count the total number of bikes matching the query
  const totalBikes = await Booking.countDocuments(brandQuery);

  return {
    booking,
    totalPages: Math.ceil(totalBikes / itemsPerPage), // Calculate total pages based on the limit
  };
};

const getMyAllRentalsFromDB = async (email: string) => {
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Find the bookings based on the userId
  const rentals = await Booking.find({ userId: user._id })
    .populate('bikeId')
    .populate('userId');

  return rentals;
};

const updateIsPaidIntoDB = async (id: string) => {
  const rental = await Booking.findById({ _id: id });
  if (!rental) {
    throw new Error('Rental not found');
  }

  const bike = await Bike.findById(rental.bikeId);
  if (!bike) {
    throw new Error('Bike not found');
  }

  rental.isPaid = true;
  await rental.save();

  // Update bike's availability status
  bike.isAvailable = true;
  await bike.save();

  return rental;
};

export const BookingServices = {
  createRentalIntoDB,
  updateAsReturnBike,
  getAllRentalsFromDB,
  getMyAllRentalsFromDB,
  updateIsPaidIntoDB,
};
