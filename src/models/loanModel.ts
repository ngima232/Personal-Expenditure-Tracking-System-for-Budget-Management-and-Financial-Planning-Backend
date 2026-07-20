import mongoose, { Schema } from "mongoose";
import { LoanInterface } from "../interfaces";
import { LoanTypeEnum, LoanStatusEnum } from "../enums";
 
const loanSchema = new Schema<LoanInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: { type: String, required: true },
    personName: { type: String, required: true },
    personContact: { type: String, required: false },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: LoanTypeEnum,
      required: true,
    },
    remarks: { type: String, required: false },
    date: { type: Date, required: true },
    returnDate: { type: Date, required: false },
    interestRate: { type: Number, required: false },
    status: {
      type: String,
      enum: LoanStatusEnum,
      default: LoanStatusEnum.UNPAID,
    },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
 
export const loanModel = mongoose.model<LoanInterface>("Loans", loanSchema);