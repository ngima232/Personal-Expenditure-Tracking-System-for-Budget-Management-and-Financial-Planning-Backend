import { NextFunction, Request, Response } from 'express';
import { HttpStatusEnum, ReasonPhrasesEnum } from '../enums';

/**
 * Error response middleware for 404 not found.
 */
export function notFound(req: Request, res: Response) {
  res.status(HttpStatusEnum.NOT_FOUND).json({
    success: false,
    code: HttpStatusEnum.NOT_FOUND,
    message: ReasonPhrasesEnum.NOT_FOUND,
  });
}

/**
 * Method not allowed error middleware. 
 */
export function methodNotAllowed(req: Request, res: Response) {
  res.status(HttpStatusEnum.METHOD_NOT_ALLOWED).json({
    success: false,
    code: HttpStatusEnum.METHOD_NOT_ALLOWED,
    message: ReasonPhrasesEnum.METHOD_NOT_ALLOWED,
  });
}

/**
 * Generic error response middleware for validation and internal server errors.
 */
export function genericErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {

  const buildError = (error: any) => {
    if (error.isJoi) {
      return {
        success: false,
        code: HttpStatusEnum.BAD_REQUEST,
        message: ReasonPhrasesEnum.BAD_REQUEST,
        details: (error.details || []).map((err: any) => ({
          message: err.message,
          param: err.path.join('.'),
        })),
      };
    } else {
      return {
        success: false,
        code: HttpStatusEnum.INTERNAL_SERVER_ERROR,
        message: ReasonPhrasesEnum.INTERNAL_SERVER_ERROR,
      };
    }
  };

  const error = buildError(err);

  res.status(error.code).json({ ...error });
}
