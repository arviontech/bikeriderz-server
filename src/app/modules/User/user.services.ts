import AppError from '../../Error/AppError';
import { TImageFile } from '../../Interface/image.interface';
import { Tuser } from './user.interface';
import { User } from './user.model';

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  let roleQuery = {};

  // Apply role filter only if role is provided and not "all"
  if (query?.role && query.role !== 'all') {
    roleQuery = { role: query.role };
  }

  const result = await User.find(roleQuery);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateUserIntoDB = async (
  email: string,
  role: string,
  payload: Partial<Tuser>,
  id?: string, // id is optional
  profileImg?: TImageFile,
) => {
  const userQuery = id ? { _id: id } : { email }; // Use ID if present, otherwise use email

  const user = await User.findOne(userQuery);
  if (!user) {
    throw new Error('User not found');
  }

  if (id) {
    if (role !== 'admin') {
      throw new AppError(401, 'You have no access to update this profile');
    }
  } else if (role !== user.role) {
    throw new AppError(401, 'You have no access to update this profile');
  }

  // Check if the user is trying to change their role from 'user' to 'admin'
  if (role === 'user' && payload.role && payload.role === 'admin') {
    throw new AppError(
      401,
      'You do not have permission to change your role to admin',
    );
  }
  const profileImagePath = (profileImg && profileImg.path) || '';

  const userData = {
    ...payload,
    profileImg: profileImagePath,
  };

  const updatedUser = await User.findOneAndUpdate(
    { $or: [{ _id: id }, { email }] },
    { $set: userData },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new Error('Failed to update user profile');
  }

  return updatedUser;
};

export const userServices = {
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
};
