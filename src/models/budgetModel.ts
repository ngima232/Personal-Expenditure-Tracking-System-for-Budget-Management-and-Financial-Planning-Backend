import mongoose, { Schema } from 'mongoose';
import { BudgetInterface } from '../interfaces';
 import {BudgetPeriodEnum} from '../enums'
const budgetSchema = new Schema<BudgetInterface>(
  {
    name: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    limitAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    period: {
      type: String,
      enum: BudgetPeriodEnum,
      default: BudgetPeriodEnum.MONTHLY,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    alertThreshold: {
      type: Number,
      default: 80,
      min: 1,
      max: 100,
    },
    description: { type: String, required: false },
    isActive: { type: Boolean, default: true },
 
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
 
budgetSchema.index({ user: 1, category: 1, startDate: 1, endDate: 1 });
 
export const budgetModel = mongoose.model<BudgetInterface>('Budgets', budgetSchema);
 