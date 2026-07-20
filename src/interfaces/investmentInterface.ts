import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";
import { Types, Document } from 'mongoose';
import { InvestmentTypeEnum } from '../enums';

export interface InputInvestmentInterface {
  user: Types.ObjectId;
  name: string;
  slug?: string;
  type: InvestmentTypeEnum;
  amount: number;
  remarks?: string;
  date: Date; 
}

export interface InvestmentInterface extends Document, ModelTimestampExtend, InputInvestmentInterface {
  _id: Types.ObjectId;
}

export interface ArgsInvestmentInterface
  extends PaginationOrderSearchExtend {
  name?: string;
  type?: string;
  user?: Types.ObjectId | any;
  startDate?: string;
  endDate?: string;
}