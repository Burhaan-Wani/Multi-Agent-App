import { Request, Response, NextFunction } from "express";

type RequestHandlerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

export const asyncHandler =
    (fn: RequestHandlerType): RequestHandlerType =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
