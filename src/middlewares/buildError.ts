import { HttpStatusEnum, ReasonPhrasesEnum } from '../enums';
import mongoose, { Error as MongooseError } from 'mongoose';

/**
 * Build error response for Mongoose errors.
 */
function buildMongooseError(err: any) {
  // Mongoose CastError (e.g., invalid ObjectId)
  if (err instanceof MongooseError.CastError) {
    return {
      success: false,
      code: HttpStatusEnum.BAD_REQUEST,
      message: ReasonPhrasesEnum.BAD_REQUEST,
      details: [
        {
          message: err.message,
        },
      ],
    };
  }

  // Mongoose Validation Error
  else if (err instanceof MongooseError.ValidationError) {
    return {
      success: false,
      code: HttpStatusEnum.BAD_REQUEST,
      message: ReasonPhrasesEnum.BAD_REQUEST,
      details: Object.values(err.errors).map((validationError: any) => {
        return {
          message: validationError.message,
          path: validationError.path,
        };
      }),
    };
  }

  // Return INTERNAL_SERVER_ERROR for all other cases
  else {
    return {
      success: false,
      code: HttpStatusEnum.INTERNAL_SERVER_ERROR,
      message: ReasonPhrasesEnum.INTERNAL_SERVER_ERROR,
    };
  }
}

export default buildMongooseError;
