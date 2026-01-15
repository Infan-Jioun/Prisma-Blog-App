import type { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
    res.status(404).json({
        meessage: "Not Found Route ",
        path: req.originalUrl,
        date: Date()
    })
}