import express, { Router, type NextFunction, type Request, type Response } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from '../../lib/auth'
import { success } from "better-auth/*";
const router = express.Router();
// middlewere
export enum UserRole {
    ADMIN = "ADMIN", USER = "USER"
}
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                name: string,
                emailVerified: boolean,
                role: string
            }
        }
    }
}
const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles);
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        console.log(session);
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Your Are Not Autorized"
            })
        }
        if (!session.user.emailVerified) {
            return res.status(401).json({
                success: false,
                message: "Email Verifcation Required. Please verify your email"
            })
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as string,
            emailVerified: session.user.emailVerified
        }

        next();
    }
}

router.post("/", auth(UserRole.USER), postController.createPost)


export const postRouter: Router = router; 