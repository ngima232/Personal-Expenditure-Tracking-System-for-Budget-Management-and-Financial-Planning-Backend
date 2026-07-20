import Joi from "joi";
import { stringSchema, booleanSchema } from "./schemas";
import { LoanInterface } from "../interfaces";
import { LoanTypeEnum, LoanStatusEnum } from "../enums";
import { list } from "../utils";
 
const createLoan = Joi.object<LoanInterface>({
  personName: stringSchema.required().label("Person Name"),
  personContact: stringSchema.optional().allow(null, "").label("Person Contact"),
  amount: Joi.number().positive().required().label("Amount"),
  type: stringSchema
    .required()
    .label("Type")
    .valid(...list(LoanTypeEnum)),
  remarks: stringSchema.optional().allow(null, "").label("Remarks"),
  date: Joi.date().required().label("Date"),
  returnDate: Joi.date().optional().allow(null).label("Return Date"),
  interestRate: Joi.number().min(0).optional().label("Interest Rate"),
  status: stringSchema
    .optional()
    .label("Status")
    .valid(...list(LoanStatusEnum)),
});
 
const updateLoan = Joi.object({
  personName: stringSchema.optional().label("Person Name"),
  personContact: stringSchema.optional().allow(null, "").label("Person Contact"),
  amount: Joi.number().positive().optional().label("Amount"),
  type: stringSchema
    .optional()
    .label("Type")
    .valid(...list(LoanTypeEnum)),
  remarks: stringSchema.optional().allow(null, "").label("Remarks"),
  date: Joi.date().optional().label("Date"),
  returnDate: Joi.date().optional().allow(null).label("Return Date"),
  interestRate: Joi.number().min(0).optional().label("Interest Rate"),
});
 
const updateLoanStatus = Joi.object({
  status: stringSchema
    .required()
    .label("Status")
    .valid(...list(LoanStatusEnum)),
});
 
export { createLoan, updateLoan, updateLoanStatus };
 