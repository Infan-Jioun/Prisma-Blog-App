import express, { Router, type Application } from "express"
import { postRouter } from "./modules/Post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
export const app: Application = express();
app.use(express.json())
// post 
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use("/posts", postRouter)
app.get("/", (req, res) => {
    res.send("Hello World ")
})