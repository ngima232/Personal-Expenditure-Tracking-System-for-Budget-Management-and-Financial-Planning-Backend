import Joi from 'joi';
import { stringSchema, numberSchema } from './schemas';
import { InvestmentInterface } from '../interfaces';
import { InvestmentTypeEnum } from '../enums';
import { list } from '../utils';

const createInvestment = Joi.object<InvestmentInterface>({
  name: stringSchema.required().label('Name'),
  type: stringSchema
    .required()
    .label('Type')
    .valid(...list(InvestmentTypeEnum)),
  amount: numberSchema.required().positive().label('Amount'),
  remarks: stringSchema.optional().label('Remarks'),
  date: stringSchema.required().label('Date'), 
});

const updateInvestment = Joi.object({
  name: stringSchema.optional().label('Name'),
  type: stringSchema
    .optional()
    .label('Type')
    .valid(...list(InvestmentTypeEnum)),
  amount: numberSchema.optional().positive().label('Amount'),
  remarks: stringSchema.optional().label('Remarks'),
  date: stringSchema.optional().label('Date'),
});

export { createInvestment, updateInvestment };