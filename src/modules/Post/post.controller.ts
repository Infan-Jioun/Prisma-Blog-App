import type { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized"
            })
        }
        const result = await postService.createPost(req.body, user.id as string);
        console.log(result);
        res.status(201).json(result)

    } catch (error) {
        res.status(400).json({
            error: "Post Creation Failed"
        })
    }
}
console.log(createPost);
export const postController = {
    createPost
}