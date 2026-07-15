import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";
import { Types, Document } from 'mongoose';
import { SavingsGoalStatusEnum } from '../enums';
 
export interface ContributionInterface {
  amount: number;
  date?: Date;
  note?: string;
}
 
export interface InputSavingsGoalInterface {
  title: string;
  slug?: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: Date;
  icon?: string;
  status?: SavingsGoalStatusEnum;
  user: Types.ObjectId;
}
 
export interface SavingsGoalInterface extends Document, ModelTimestampExtend, InputSavingsGoalInterface {
  _id: Types.ObjectId;
  contributions: ContributionInterface[];
}
 
export interface ArgsSavingsGoalInterface extends PaginationOrderSearchExtend {
  user?: Types.ObjectId | any;
  status?: string;
}