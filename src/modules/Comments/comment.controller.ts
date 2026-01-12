import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const result = await commentService.createComment();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Comment Creation Failed",
            details: error
        })
    }
}
export const commentController = {
    createComment
}