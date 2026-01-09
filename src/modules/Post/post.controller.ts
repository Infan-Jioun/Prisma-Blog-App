import type { Request, Response } from "express"
import { postService } from "./post.service"
const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = await req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tegs ? (req.query.tags as string).split(",") : []
        const result = await postService.getAllPost({ search: searchString, tags });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Get Post Failed"
        })
    }
}

const createPost = async (req: Request, res: Response) => {
    try {
        const user = await req.user;
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
    createPost,
    getAllPost
}