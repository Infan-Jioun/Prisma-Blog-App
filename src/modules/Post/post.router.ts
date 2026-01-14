import express, { Router, type NextFunction, type Request, type Response } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from '../../lib/auth'
import { auth, UserRole } from "../../middlewere/auth";

const router = express.Router();
// middlewere

router.get("/", postController.getAllPost)
router.get("/my-post", auth(UserRole.USER, UserRole.ADMIN), postController.getMyPost)
router.post("/", auth(UserRole.USER), postController.createPost)
router.get("/:id", postController.getPostById)
router.patch("/:postId", auth(UserRole.USER, UserRole.ADMIN), postController.updatePost)

export const postRouter: Router = router; 