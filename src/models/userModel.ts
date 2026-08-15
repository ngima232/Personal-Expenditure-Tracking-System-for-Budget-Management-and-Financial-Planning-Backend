import mongoose, { Schema } from 'mongoose';
import { UserInterface } from '../interfaces';
import { AuthProviderEnum} from '../enums'
const userSchema = new Schema<UserInterface>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true , required: true, lowercase: true, trim: true},
    // password: {type: String,required: false,select: false},
    password: {type: String,required: false},
    image: { type: String, required: false },
    currency: { type: String, required: false },
    deviceToken: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows many docs with no googleId
    },
    authProvider: {
      type: String,
      enum: AuthProviderEnum,
      required: true,
      default: AuthProviderEnum.local,
    },
     otp: {
      type: Number,
    },

    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
export const userModel =  mongoose.model<UserInterface>('User', userSchema);
