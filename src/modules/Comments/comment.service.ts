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
const deleteComment = async () => {
    console.log("deleted comment");
}
export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment
}