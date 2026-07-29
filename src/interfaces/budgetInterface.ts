import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";
import { Types, Document } from 'mongoose';
import { BudgetPeriodEnum } from '../enums';
 
export interface InputBudgetInterface {
  name: string;
  category: Types.ObjectId;
  user: Types.ObjectId;
  limitAmount: number;
  period: BudgetPeriodEnum;
  startDate: Date;
  endDate: Date;
  alertThreshold?: number;
  description?: string;
  isActive?: boolean;
}
 
export interface BudgetInterface extends Document, ModelTimestampExtend, InputBudgetInterface {
  _id: Types.ObjectId;
}
 
export interface ArgsBudgetInterface extends PaginationOrderSearchExtend {
  user?: Types.ObjectId | any;
  category?: Types.ObjectId | any;
  period?: string;
  isActive?: boolean;
  name?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}