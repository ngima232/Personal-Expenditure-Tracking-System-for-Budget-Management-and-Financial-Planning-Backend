import mongoose, { Schema } from 'mongoose';
import { TransactionInterface } from '../interfaces';
 import { TransactionTypeEnum,PaymentMethodEnum} from '../enums'
 
const transactionSchema = new Schema<TransactionInterface>(
  {
    title: { type: String, required: false },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    type: {
      type: String,
      enum: TransactionTypeEnum,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    description: { type: String, required: false },
    paymentMethod: {
      type: String,
      enum: PaymentMethodEnum,
      default: PaymentMethodEnum.MOBILE_WALLET,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachment: { type: String, required: false },
 
 
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
 
transactionSchema.index({ user: 1, type: 1, date: -1 });
 
export const transactionModel = mongoose.model<TransactionInterface>('Transactions', transactionSchema);