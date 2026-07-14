import Joi from 'joi';
import { stringSchema, booleanSchema } from './schemas';
import { TransactionInterface } from '../interfaces';
import { TransactionTypeEnum, PaymentMethodEnum, RecurrenceFrequencyEnum } from "../enums";
import { list } from "../utils";
 

 
const createTransaction = Joi.object<TransactionInterface>({
  title: stringSchema.optional().allow('', null).label('Title'),
  category: stringSchema.required().label('Category'),
  type: stringSchema
    .required()
    .label("Type")
    .valid(...list(TransactionTypeEnum)),
  amount: Joi.number().positive().required().label('Amount'),
  description: stringSchema.optional().allow('', null).label('Description'),
  paymentMethod: stringSchema
    .optional()
    .label("Payment Method")
    .valid(...list(PaymentMethodEnum)),
  date: Joi.date().required().label('Date'),
  attachment: stringSchema.optional().allow('', null).label('Attachment'),
});
 
const updateTransaction = Joi.object({
  title: stringSchema.optional().allow('', null).label('Title'),
  category: stringSchema.optional().label('Category'),
  type: stringSchema
    .optional()
    .label("Type")
    .valid(...list(TransactionTypeEnum)),
  amount: Joi.number().positive().optional().label('Amount'),
  description: stringSchema.optional().allow('', null).label('Description'),
  paymentMethod: stringSchema
    .optional()
    .label("Payment Method")
    .valid(...list(PaymentMethodEnum)),
  date: Joi.date().optional().label('Date'),
  attachment: stringSchema.optional().allow('', null).label('Attachment'),
});
 
export { createTransaction, updateTransaction };