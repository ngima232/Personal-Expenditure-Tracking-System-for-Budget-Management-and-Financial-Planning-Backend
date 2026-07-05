import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const globalError: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: 'error',
    message: error.message,
  });
  res.status(500).json({
    success: false,
    code: 500,
    message: 'Internal Server Error',
    details: error.message,
  });
};

export default globalError;
