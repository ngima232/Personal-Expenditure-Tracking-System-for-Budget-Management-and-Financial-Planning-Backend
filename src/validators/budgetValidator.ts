import Joi from 'joi';
import { stringSchema, booleanSchema } from './schemas';
import { BudgetInterface } from '../interfaces';
import { BudgetPeriodEnum } from "../enums";
import { list } from "../utils";
 
const createBudget = Joi.object<BudgetInterface>({
  name: stringSchema.required().label('Name'),
  category: stringSchema.required().label('Category'),
  limitAmount: Joi.number().positive().required().label('Limit Amount'),
  period: stringSchema
    .required()
    .label("Period")
    .valid(...list(BudgetPeriodEnum)),
  startDate: Joi.date().required().label('Start Date'),
  endDate: Joi.date().required().greater(Joi.ref('startDate')).label('End Date'),
  alertThreshold: Joi.number().min(1).max(100).optional().label('Alert Threshold'),
  description: stringSchema.optional().allow(null, "").label('Description'),
  isActive: booleanSchema.optional().allow(null, "").label("Is Active"),
});
 
const updateBudget = Joi.object({
 name: stringSchema.optional().label('Name'),
  category: stringSchema.optional().label('Category'),
  limitAmount: Joi.number().positive().optional().label('Limit Amount'),
  period: stringSchema
    .optional()
    .label("Period")
    .valid(...list(BudgetPeriodEnum)),
  startDate: Joi.date().optional().label('Start Date'),
  endDate: Joi.date().optional().label('End Date'),
  alertThreshold: Joi.number().min(1).max(100).optional().label('Alert Threshold'),
  description: stringSchema.optional().allow(null, "").label('Description'),
  isActive: booleanSchema.optional().allow(null, "").label("Is Active"),
});
 
export { createBudget,updateBudget}
