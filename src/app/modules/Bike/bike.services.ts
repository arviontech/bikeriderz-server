/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Types } from 'mongoose';
import { Booking } from '../Booking/booking.model';
import { TBike } from './bike.interface';
import { Bike } from './bike.model';
import { mapImagePaths } from '../../Utills/ImagePathUtilityFuntion';

const CreateBikeIntoDB = async (
  payload: TBike,
  files?: { [key: string]: Express.Multer.File[] },
) => {
  const imageFields = ['bikeImages'];
  imageFields.forEach((field) => {
    if (files?.[field]) {
      (payload as any)[field] = mapImagePaths(files[field]);
    } else {
      (payload as any)[field] = [];
    }
  });

  const newBike = await Bike.create(payload);
  return newBike;
};

const getAllBikesFromDB = async (query: Record<string, unknown>) => {
  let excludeBookedBikes: Types.ObjectId[] = [];

  // Find booked bikes for the given brand and start date
  if (query?.brand && query?.startTime) {
    const startDate = new Date(query.startTime as string)
      .toISOString()
      .split('T')[0];

    // Step 1: Find bookings matching the start date
    const bookings = await Booking.find({
      $expr: {
        $eq: [{ $substr: ['$startTime', 0, 10] }, startDate], // Compare date part
      },
    }).select('bikeId');

    // Step 2: Extract bikeId from bookings
    excludeBookedBikes = bookings.map((booking) => booking.bikeId);

    // Step 3: Find bikes booked under the same brand
    if (excludeBookedBikes.length > 0) {
      const brandBikesBooked = await Bike.find({
        brand: query.brand,
        _id: { $in: excludeBookedBikes },
      }).select('_id');

      // Add the bikes booked under the same brand to exclusion list
      const bookedBrandBikeIds = brandBikesBooked.map((bike) => bike._id);
      excludeBookedBikes.push(...bookedBrandBikeIds);
    }
  }

  const queryObj = { ...query };
  const bikeSearchableFields = ['name', 'model', 'brand'];
  let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Bike.find({
    $or: bikeSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  let limit: number = Number(query?.limit || 12);
  let skip: number = 0;

  if (query?.page) {
    const page: number = Number(query?.page || 1);
    skip = (page - 1) * limit;
  }

  const skipQuery = searchQuery.skip(skip);
  const limitQuery = skipQuery.limit(limit);

  // Sorting
  let sortBy = '-createdAt'; // Default sort by latest
  if (query?.sortBy === 'price-low-high') {
    sortBy = 'pricePerHour'; // Ascending order
  } else if (query?.sortBy === 'price-high-low') {
    sortBy = '-pricePerHour'; // Descending order
  }
  const sortQuery = limitQuery.sort(sortBy);

  // Field filtering
  let fields = '';
  if (query?.fields) {
    fields = (query?.fields as string).split(',').join(' ');
  }

  const fieldQuery = sortQuery.select(fields);

  // Availability Filter
  let availabilityQuery = {};
  if (query?.availability !== undefined && query.availability !== 'all') {
    availabilityQuery = { isAvailable: query.availability === 'true' };
  }

  // Price Range Filter
  let priceRangeQuery = {};
  if (query.minPrice || query.maxPrice) {
    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || Infinity;
    priceRangeQuery = { pricePerHour: { $gte: minPrice, $lte: maxPrice } };
  }

  // Brand Filter
  let brandQuery = {};
  if (query?.brand && query.brand !== 'All Brands') {
    brandQuery = { brand: query.brand };
  }

  // Exact match filtering
  const excludeFields = [
    'searchTerm',
    'sortBy',
    'limit',
    'page',
    'fields',
    'availability',
    'minPrice',
    'maxPrice',
    'brand',
    'startTime',
  ];
  excludeFields.forEach((el) => delete queryObj[el]);

  const combinedQuery = {
    ...queryObj,
    ...availabilityQuery,
    ...priceRangeQuery,
    ...brandQuery,
    _id: { $nin: excludeBookedBikes }, // Exclude booked bikes
  };

  const bikes = await fieldQuery.find(combinedQuery);

  // Count total documents for pagination
  const totalBikes = await Bike.countDocuments(combinedQuery);

  return {
    bikes,
    totalPages: Math.ceil(totalBikes / limit),
  };
};

const getSingleBikesFromDB = async (id: string) => {
  const result = await Bike.findById(id);
  return result;
};

const updateBikeIntoDB = async (
  id: string,
  payload: Partial<TBike>,
  files?: { [key: string]: Express.Multer.File[] },
) => {
  const imageFields = ['bikeImages'];
  imageFields.forEach((field) => {
    if (files?.[field]) {
      (payload as any)[field] = mapImagePaths(files[field]);
    } else {
      (payload as any)[field] = [];
    }
  });
  const result = await Bike.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteBikeFromDB = async (id: string) => {
  const result = await Bike.findByIdAndUpdate(
    { _id: id },
    {
      isAvailable: false,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const BikeServices = {
  CreateBikeIntoDB,
  getAllBikesFromDB,
  getSingleBikesFromDB,
  updateBikeIntoDB,
  deleteBikeFromDB,
};
