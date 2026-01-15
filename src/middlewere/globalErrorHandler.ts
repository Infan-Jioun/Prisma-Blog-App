import type { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

    let statusCode = 500;
    let errorMessage = "Internal server error";
    let errorDetails = err
    // Prisma Client VaildationError 

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provide incorrect field type or missing fields"
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code == "P2025") {
            statusCode = 400,
                errorMessage = "An operation failed because it depends on one or more records that were required but not found"
        }
        else if (err.code == "P2002") {
            statusCode = 400,
                errorMessage = "Duplicate Key Error"
        }
        else if (err.code == "P2003") {
            statusCode = 400,
                errorMessage = "Foreign key constraint failed "
        }
    }

    res.status(500)
    res.json({
        message: errorMessage,
        error: errorDetails
    })
}
