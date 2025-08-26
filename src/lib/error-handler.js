import { HttpError } from "./errors.js";

function ErrorHandler(err, req, res, next)  {
    if (err instanceof HttpError) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message
        });
    } 
    console.error(err);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
}


export { ErrorHandler as ErrorHandler };
