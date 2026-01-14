import type { Request, Response } from "express"
import { postService } from "./post.service"
import type { PostStatus } from "../../../generated/prisma/enums";
import { paginaitionSortingHelper } from "../../helpers/paginaitionSortingHelper";
import { UserRole } from "../../middlewere/auth";
const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = await req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tegs ? (req.query.tags as string).split(",") : []
        const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined : undefined;
        console.log({ isFeatured });
        const status = req.query.status as PostStatus | undefined;
        const authorId = req.query.authorId as string | undefined;
        const option = paginaitionSortingHelper(req.query)
        const { page, limit, skip, sortBy, sortOrder } = option;
        const result = await postService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });

        console.log("Option--", option);

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
        res.status(201).json(result);
        console.log(result);

    } catch (error) {
        res.status(400).json({
            error: "Post Creation Failed"
        })
    }
}


const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Post id is required");
        }

        const result = await postService.getPostById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Fetch Failed",
        });
    }
};
const getMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized")
        }


        const result = await postService.getMyPost(user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Fetch Failed",
        });
    }
};
const updatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized")
        }
        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN;
        console.log(isAdmin);
        const result = await postService.updatePost(postId as string, req.body, user.id, isAdmin);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Update Failed",
        });
    }
};
const deletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized")
        }
        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN;
        console.log(isAdmin);
        const result = await postService.deletePost(postId as string,  user.id, isAdmin);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "delete Failed",
        });
    }
};

export const postController = {
    createPost,
    getAllPost,
    getPostById,
    getMyPost,
    updatePost,
    deletePost
}