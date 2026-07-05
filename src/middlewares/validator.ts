import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

class Validator {
  private static instance: Validator;
  private constructor() { }

  static get(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }

  check = (input: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { value, error } = input.validate(req.body, {
        abortEarly: false,
      });
      if (error) next(error);
      req.body = value;
      next();
    };
  };

}

const validator = Validator.get();

export { validator as Validator };
