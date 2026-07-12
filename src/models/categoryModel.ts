import mongoose, { Schema } from 'mongoose';
import { CategoryInterface } from '../interfaces';
import { TransactionTypeEnum} from '../enums'

const categorySchema = new Schema<CategoryInterface>(
  {
    name: { type: String, required: true },
    slug: { type: String , required: true},
    type: {
      type: String,
      enum: TransactionTypeEnum,
      required: true,
    },
    user:{
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    icon: { type: String, required: false },
    color: { type: String, required: false },
    isDefault: {
    type: Boolean,
    default: false
  },
  
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
export const categoryModel =  mongoose.model<CategoryInterface>('Categories', categorySchema);
