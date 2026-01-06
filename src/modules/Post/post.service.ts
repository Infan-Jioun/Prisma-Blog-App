import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id " | "createdId" | "updatedId">) => {
    const result = await prisma.post.create({
        data
    })
    console.log(result);
}
export const postService = {
    createPost
}