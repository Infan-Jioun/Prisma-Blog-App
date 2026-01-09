import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPost = async ({ search, tags }: { search: string | undefined, tags: string[] | [] }) => {
    const addConditions = [];
    if (search) {
        addConditions.push({
            OR: [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search as string
                    }
                }

            ],
        })
    }
    if (tags.length > 0) {
        addConditions.push(
            {
                tags: {
                    hasEvery: tags as string[]
                }
            }
        )
    }
    const allpost = await prisma.post.findMany({

        where: {


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