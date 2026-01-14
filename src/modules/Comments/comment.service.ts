import type { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const createComment = async (payload: { content: string, authorId: string, postId: string, parentId?: string }) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })
    if (payload.parentId) {
        await prisma.comment.findFirstOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }
    return await prisma.comment.create({
        data: payload
    })

}
const getCommentById = async (commentId: string) => {
    return await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        },

    })

}
const getCommentByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: { created: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}
const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        }
    })
    if (!commentData) {
        throw new Error("Your Provided input is invaild")
    }
    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })

}
const updateComment = async (commentId: string, data: {
    content: string, status: CommentStatus
}, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })
    if (!commentData) {
        throw new Error("Your Provide input is invaild")
    }
    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        }, data
    })
}
const moderateComment = async (id: string, data: { status: CommentStatus }) => {
    await prisma.comment.findUniqueOrThrow({
        where: {
            id
        }, select : {
            id : true ,
            status : true 
        }
    })
    return await prisma.comment.update({
        where: {
            id
        }, data
    })
}
export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}