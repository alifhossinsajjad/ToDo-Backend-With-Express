
import type { ErrorRequestHandler } from "express";
import ApiError from "../errors/ApiError.js";

/**
 * Global Error Handling Middleware
 * Intercepts all unhandled errors and ApiError instances to send a standard JSON response.
 */
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error!";

  // Check if it's our custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    // Handle generic JS Errors
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Provide error stack only in development mode for debugging
    errorStack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
