import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPost = async (payload: { search: string | undefined }) => {
    const allpost = await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: payload.search as string,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: payload.search as string,
                        mode: "insensitive"
                    }
                },
                {
                    tags : {
                       has : payload.search as string
                    }
                }

            ]
        }
    });
    return allpost;
}

const createPost = async (data: Omit<Post, "id " | "createdId" | "updatedId" | "authorId">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId

        }
    })
    console.log(result);
}
export const postService = {
    createPost,
    getAllPost
}