import type { NextFunction, Request, RequestHandler, Response } from "express";


/**
 * Higher-order function that wraps async route handlers to automatically
 * catch errors and pass them to the global error handler via next().
 * This removes the need for writing try-catch blocks in every controller.
 */
const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
