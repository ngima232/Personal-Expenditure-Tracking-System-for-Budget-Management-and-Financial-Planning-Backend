import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";
import { Types, Document } from 'mongoose';
import { AuthProviderEnum } from '../enums'
export interface InputeUserInterface {
  name: string;
  email: string;
  password: string;
  image?: string;
  currency?: string; 
  googleId?: string;
  authProvider?:AuthProviderEnum
  deviceToken?:string
    otp?: number;
}


export interface UserInterface extends Document, ModelTimestampExtend, InputeUserInterface {
  _id: Types.ObjectId;
}

export interface ChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface UserLogin {
  email: string;
  password: string;
  deviceToken?: string;
}

export interface GetUserInterface {
  id: any | string;
  name: string;
}

export interface ConfirmForgotPasswordInterface {
  officeEmail: string;
  otp: number;
  newPassword: string;
}

export interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
}
