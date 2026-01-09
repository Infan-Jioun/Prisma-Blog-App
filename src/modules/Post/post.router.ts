import express, { Router, type NextFunction, type Request, type Response } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from '../../lib/auth'
import { auth, UserRole } from "../../middlewere/auth";

 const router = express.Router();
// middlewere

router.get("/" , postController.getAllPost)
router.post("/", auth(UserRole.USER), postController.createPost)


export const postRouter: Router = router; 