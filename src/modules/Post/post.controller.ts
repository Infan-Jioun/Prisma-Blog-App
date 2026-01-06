import type { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postService.createPost(req.body);
        console.log(result);
        res.status(201).json(result)

    } catch (error) {
        res.status(400).json({
            error: "Post Creation Failed"
        })
    }
}
export const postController = {
    createPost
}