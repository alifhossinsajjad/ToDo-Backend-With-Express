/**
 * Custom Error Class for handling API errors.
 * It extends the built-in Error class and adds an HTTP status code.
 */
class ApiError extends Error {
    statusCode;
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default ApiError;
