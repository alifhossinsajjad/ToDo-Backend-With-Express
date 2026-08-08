
import type { ZodSchema } from "zod";
import catchAsync from "../utils/catchAsync.js";
import type { NextFunction, Request, Response } from "express";
/**
 * Middleware to validate incoming request data against a Zod schema.
 * If validation fails, Zod throws an error which is caught by catchAsync
 * and passed to the globalErrorHandler.
 */
const validateRequest = (schema: ZodSchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Parse the request body against the schema
    await schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export default validateRequest;
