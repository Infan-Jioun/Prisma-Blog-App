const createComment = async (payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string
}) => {
    console.log("success", payload);
}
export const commentService = {
    createComment
}