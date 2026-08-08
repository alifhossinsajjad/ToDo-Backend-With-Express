/**
 * Higher-order function that wraps async route handlers to automatically
 * catch errors and pass them to the global error handler via next().
 * This removes the need for writing try-catch blocks in every controller.
 */
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
export default catchAsync;
