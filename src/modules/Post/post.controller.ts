import type { Request, Response } from "express"
import { postService } from "./post.service"
import type { PostStatus } from "../../../generated/prisma/enums";
import { paginaitionSortingHelper } from "../../helpers/paginaitionSortingHelper";
const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = await req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tegs ? (req.query.tags as string).split(",") : []
        const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined : undefined;
        console.log({ isFeatured });
        const status = req.query.status as PostStatus | undefined;
        const authorId = req.query.authorId as string | undefined;
        const page = Number(req.query.page ?? 0);
        const limit = Number(req.query.limit ?? 10)
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy as string | undefined;
        const sortOrder = req.query.sortOrder as string | undefined;
        const result = await postService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
        const option = paginaitionSortingHelper(req.query)

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