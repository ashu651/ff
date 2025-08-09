import { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler<T extends RequestHandler>(fn: T): RequestHandler {
  return (req: any, res: any, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}