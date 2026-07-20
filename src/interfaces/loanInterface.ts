import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";
import { Types, Document } from "mongoose";
import { LoanTypeEnum, LoanStatusEnum } from "../enums";
 
export interface InputLoanInterface {
  user: Types.ObjectId;
  personName: string;
  personContact?: string;
  amount: number;
  type: LoanTypeEnum;
  remarks?: string;
  slug?: string;
  date: Date;
  returnDate?: string;
  interestRate?: number;
  status?: LoanStatusEnum;
}
 
export interface LoanInterface
  extends Document,
    ModelTimestampExtend,
    InputLoanInterface {
  _id: Types.ObjectId;
}
 
export interface ArgsLoanInterface extends PaginationOrderSearchExtend {
  type?: string;
  status?: string;
  user?: Types.ObjectId | any;
}
 