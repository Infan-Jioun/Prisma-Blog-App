import type { Post, PostStatus } from "../../../generated/prisma/client";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllPost = async ({ search, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder }: { search: string | undefined, tags: string[] | [], isFeatured: boolean | undefined, status: PostStatus | undefined, authorId: string | undefined, page: number, limit: number, skip: number, sortBy: string, sortOrder: string }) => {
    const addConditions: PostWhereInput[] = [];
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
    if (typeof isFeatured === "boolean") {
        addConditions.push({
            isFeatured: isFeatured
        })
    }
    if (status) {
        addConditions.push({
            status: {
                equals: status
            }
        })
    }
    if (authorId) {
        addConditions.push({
            authorId
        })
    }
    const allpost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: addConditions

        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma.post.count({
        where: {
            AND: addConditions
        }
    })
    return { data: allpost, pagination: total , page, limit , totalPage : Math.ceil(total/limit) };
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