import catchAsync from '../../Utills/catchAsync';
import sendResponse from '../../Utills/sendResponse';
import { BookingServices } from './booking.services';

const createRental = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await BookingServices.createRentalIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Rental created successfully',
    data: result,
  });
});

const returnBike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.updateAsReturnBike(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bike returned successfully',
    data: result,
  });
});

const getAllRental = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllRentalsFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Bookings retrieved  successfully',
    data: result,
  });
});

const getMyAllRental = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await BookingServices.getMyAllRentalsFromDB(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My bookings retrieved successfully',
    data: result,
  });
});

const payTotalCost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.updateIsPaidIntoDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Your payment is successfull',
    data: result,
  });
});

export const BookingController = {
  createRental,
  returnBike,
  getAllRental,
  getMyAllRental,
  payTotalCost,
};
