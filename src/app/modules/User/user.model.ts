/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { Tuser } from './user.interface';
import { USER_Role } from './user.constants';
import bcrypt from 'bcryptjs';
import { config } from '../../config';

const userSchema = new Schema<Tuser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    profileImg: {
      type: String,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: Object.keys(USER_Role),
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

//password field won't be shown in json response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

//password hash by bcrypt
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // Only hash the password if it has been modified (i.e., during password changes). With this update, when you change fields like status or any other non-password-related fields, the password will remain unchanged in the database.
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

// userSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

export const isPasswordMatched = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatched = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatched;
};

//check if password changed after the token was issued. if that then the previous jwt token will be invalid
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000; //at first getTime () method converts the UTC time in seconds then it convert in miliseconds / 1000
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<Tuser>('User', userSchema);
