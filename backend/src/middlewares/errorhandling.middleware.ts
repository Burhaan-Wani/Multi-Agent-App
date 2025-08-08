import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";
import config from "../config/app.config.js";

const sendDevError = (err: AppError, res: Response) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err,
        stack: err.stack,
    });
};

const sendProdError = (err: AppError, res: Response) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log("ERROR: ", err);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
};
export const errorHandlingMiddleware = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (config.NODE_ENV === "development") {
        sendDevError(err, res);
    } else if (config.NODE_ENV === "production") {
        sendProdError(err, res);
    } else {
        console.log(
            `NODE_ENV variable not set. Falling back to normal error response`
        );
        res.status(err.statusCode || 500).json({
            status: err.status || "error",
            message: err.message || "Something went wrong",
        });
    }
};
