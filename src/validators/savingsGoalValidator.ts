import Joi from 'joi';
import { stringSchema, booleanSchema } from './schemas';
import { SavingsGoalInterface } from '../interfaces';
import { SavingsGoalStatusEnum } from "../enums";
import { list } from "../utils";
 
const createSavingsGoal = Joi.object<SavingsGoalInterface>({
  title: stringSchema.required().label('Title'),
  description: stringSchema.optional().label('Description'),
  targetAmount: Joi.number().positive().required().label('Target Amount'),
  currentAmount: Joi.number().min(0).optional().label('Current Amount'),
  targetDate: Joi.date().optional().label('Target Date'),
  icon: stringSchema.optional().allow(null, "").label('Icon'),
  status: stringSchema
    .optional()
    .label("Status")
    .valid(...list(SavingsGoalStatusEnum)),
});
 
const updateSavingsGoal = Joi.object({
  title: stringSchema.optional().label('Title'),
  description: stringSchema.optional().label('Description'),
  targetAmount: Joi.number().positive().optional().label('Target Amount'),
  targetDate: Joi.date().optional().label('Target Date'),
  icon: stringSchema.optional().allow(null, "").label('Icon'),
  status: stringSchema
    .optional()
    .label("Status")
    .valid(...list(SavingsGoalStatusEnum)),
});
 
const addContribution = Joi.object({
  amount: Joi.number().positive().required().label('Amount'),
  date: Joi.date().optional().label('Date'),
  note: stringSchema.optional().allow('', null).label('Note'),
});
 
export { createSavingsGoal, updateSavingsGoal, addContribution };