import Joi from 'joi';
import { stringSchema, dateSchema,arraySchema ,emailSchema,numberSchema} from './schemas'; 
import { UserInterface } from '../interfaces';

const createUser = Joi.object<UserInterface>({
  name: stringSchema.required().label('name'),
  email: emailSchema
    .required()
    .label("Email")
    .when(Joi.ref("$strict"), { then: Joi.required() }),
  password: stringSchema.label("Password").required(),
  image: Joi.binary().optional().label('Image'),
  currency: stringSchema.optional().label('Currency'),

});

const updateUser = Joi.object({
  name: stringSchema.optional().label('Title'),
  email: emailSchema
    .optional()
    .allow(null, "")
    .label("Email")
    .trim(),
  image: Joi.binary().optional().label('Image'),
  currency: stringSchema.optional().label('Content'),
   password: stringSchema.label("Password").optional(),
});


const login = Joi.object({
  email: emailSchema.label("Email").required().trim(),
  password: stringSchema.label("Password").required(),
  deviceToken: stringSchema.optional().allow(null, "").label("DeviceToken"),
});

const  changePassword = Joi.object({
  otp: numberSchema.label("OTP").required(),
  email: emailSchema.label("Email").required().trim(),
  password: stringSchema.label("Password").required(),
});

const forgotPassword = Joi.object({
  email: emailSchema.label("Email").required().trim(),
});

export { createUser, updateUser ,login,changePassword,forgotPassword};
