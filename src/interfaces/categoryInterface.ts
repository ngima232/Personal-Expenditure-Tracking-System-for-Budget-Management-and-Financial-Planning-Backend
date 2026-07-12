import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";
import { Types, Document } from 'mongoose';
import { TransactionTypeEnum } from '../enums'

export interface InputeCategoryInterface {
  name: string;
  slug?: string;
  type:TransactionTypeEnum;
  user: Types.ObjectId;
  icon?: string;
  color?: string;
  isDefault: boolean
}


export interface CategoryInterface extends Document, ModelTimestampExtend, InputeCategoryInterface {
  _id: Types.ObjectId;
}

export interface ArgsCategoryInterface
  extends PaginationOrderSearchExtend {
  name?: string;
  type?:string;
  user?: Types.ObjectId | any;
}




