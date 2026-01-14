import { CommentStatus, type Post, type PostStatus } from "../../../generated/prisma/client";
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
        },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    });
    const total = await prisma.post.count({
        where: {
            AND: addConditions
        }
    })
    return { data: allpost, pagination: total, page, limit, totalPage: Math.ceil(total / limit) };
}

const createPost = async (data: Omit<Post, "id " | "createdId" | "updatedId" | "authorId">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId

        }
    })
    // console.log(result);
}

const getPostById = async (postId: string) => {

    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            }, data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: { created: "desc" },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: { created: "asc" },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: { created: "asc" },
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        });
        return postData;
    })

};
const getMyPost = async (authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "Active"
        }, select: {
            id: true
        }
    })

    const result = await prisma.post.findMany({
        where: {
            authorId
        }, orderBy: {
            createdAt: "desc"
        }, include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })
    const total = await prisma.post.aggregate({
        _count: {
            id: true
        },

    })

    return {
        data: result,
        total
    };
}

const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }

    })
    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not the owner/creator of the post ")
    }
    if(!isAdmin){
        delete data.isFeatured
    }
    const result = prisma.post.update({
        where: {
            id: postData.id
        }, data
    })
    return result;
}

export const postService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPost,
    updatePost
}