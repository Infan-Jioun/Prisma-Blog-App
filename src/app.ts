import express, { Router, type Application } from "express"
import { postRouter } from "./modules/Post/post.router";
export const app: Application = express();
app.use(express.json())
// post 
app.use("/posts", postRouter)
app.get("/", (req, res) => {
    res.send("Hello World ")
})