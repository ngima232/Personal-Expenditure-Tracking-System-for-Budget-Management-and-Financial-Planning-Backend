import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";
import { Types, Document } from 'mongoose';
import { TransactionTypeEnum, PaymentMethodEnum, RecurrenceFrequencyEnum } from '../enums';
 export interface InputTransactionInterface {
  title?: string;
  category: Types.ObjectId;
  type: TransactionTypeEnum; //income,expense
  amount: number;
  description?: string;
  paymentMethod?: PaymentMethodEnum; //cash,card,bank_transfer,mobile_wallet,other
  date: Date;
  user: Types.ObjectId;
  attachment?: string; // receipt image
}
 
export interface TransactionInterface extends Document, ModelTimestampExtend, InputTransactionInterface {
  _id: Types.ObjectId;
}
 
export interface ArgsTransactionInterface extends PaginationOrderSearchExtend {
  user?: Types.ObjectId | any;
  type?: string;
  category?: Types.ObjectId | any;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}