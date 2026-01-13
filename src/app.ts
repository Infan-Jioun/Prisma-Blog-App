import express, { Router, type Application } from "express"
import { postRouter } from "./modules/Post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
import { commentRouter } from "./modules/Comments/comment.router";
export const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// post 
// app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use("/posts", postRouter)
app.use("/comments", commentRouter)
app.get("/", (req, res) => {
    res.send("Hello World")
})