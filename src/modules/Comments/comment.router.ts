import express, { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, UserRole } from "../../middlewere/auth";

const router = express.Router();

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);
router.get("/author/:authorId", commentController.getCommentByAutor)
router.get("/:commentId", commentController.getCommentById)


export const commentRouter: Router = router;