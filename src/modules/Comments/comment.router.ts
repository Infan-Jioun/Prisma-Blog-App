import express, { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, UserRole } from "../../middlewere/auth";
import { commentService } from "./comment.service";
const router = express.Router();
router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentService.createComment)
export const commentRouter: Router = router;