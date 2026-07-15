import mongoose, { Schema } from 'mongoose';
import { SavingsGoalInterface } from '../interfaces';
 import {SavingsGoalStatusEnum} from '../enums';

const contributionSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, default: Date.now },
    note: { type: String, required: false },
  },
  { _id: false }
);
 
const savingsGoalSchema = new Schema<SavingsGoalInterface>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: false },
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetDate: { type: Date, required: false },
    icon: { type: String, required: false },
    status: {
      type: String,
      enum: SavingsGoalStatusEnum,
      default: SavingsGoalStatusEnum.IN_PROGRESS,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributions: [contributionSchema],
 
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
 
savingsGoalSchema.virtual('progressPercent').get(function (this: SavingsGoalInterface) {
  if (!this.targetAmount) return 0;
  return Math.min(100, Math.round((this.currentAmount! / this.targetAmount) * 100));
});
 
savingsGoalSchema.set('toJSON', { virtuals: true });
savingsGoalSchema.set('toObject', { virtuals: true });
 
export const savingsGoalModel = mongoose.model<SavingsGoalInterface>('SavingsGoals', savingsGoalSchema);