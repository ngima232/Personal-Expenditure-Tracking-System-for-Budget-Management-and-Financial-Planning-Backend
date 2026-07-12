import Joi from 'joi';
import { stringSchema, booleanSchema} from './schemas'; 
import { CategoryInterface } from '../interfaces';
import { TransactionTypeEnum } from "../enums";
import { list } from "../utils";

const createCategory = Joi.object<CategoryInterface>({
  name: stringSchema.required().label('Name'),
  type: stringSchema
    .required()
    .label("Type")
    .valid(...list(TransactionTypeEnum)),
  icon: stringSchema.label("Icon").optional(),
  color: Joi.binary().optional().label('Color'),
 isDefault: booleanSchema.optional().allow(null, "").label("Is Default"),

});

const updateCategory = Joi.object({
 name: stringSchema.optional().label('Name'),
 type: stringSchema
    .optional()
    .label("Type")
    .valid(...list(TransactionTypeEnum)),
  icon: stringSchema.label("Icon").optional(),
  color: Joi.binary().optional().label('Color'),
 isDefault: booleanSchema.optional().allow(null, "").label("Is Default"),
});


export { createCategory, updateCategory};
