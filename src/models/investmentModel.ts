import mongoose, { Schema } from 'mongoose';
import { InvestmentInterface } from '../interfaces';
import { InvestmentTypeEnum } from '../enums';

const investmentSchema = new Schema<InvestmentInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: false }, 
    type: {
      type: String,
      enum: InvestmentTypeEnum,
      required: true,
    },
    amount: { type: Number, required: true },
    remarks: { type: String, required: false },
    date: { type: Date, required: true }, 
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);


investmentSchema.index({ user: 1, type: 1, slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });

export const investmentModel = mongoose.model<InvestmentInterface>('Investments', investmentSchema);