import express, { Router, type NextFunction, type Request, type Response } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from '../../lib/auth'
import { success } from "better-auth/*";
const router = express.Router();
// middlewere
// enum Roles {
//     "ADMIN", "USER"
// }
declare global {
    namespace express {
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
const auth = (...roles: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles);
        const sesstion = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        console.log(sesstion);
        if (!sesstion) {
            return res.status(401).json({
                success: false,
                message: "Your Are Not Autorized"
            })
        }
        if (!sesstion.user.emailVerified) {
            return res.status(401).json({
                success: false,
                message: "Email Verifcation Required. Please verify your email"
            })
        }

        next();
    }
}

router.post("/", auth("USER"), postController.createPost)


export const postRouter: Router = router; 