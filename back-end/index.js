import express from "express"
import {config} from "dotenv"
import cors from "cors"
import { connectToDB } from "./database/connectToDB.js"
import userRoutes from "./routes/userRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
import commetRoutes from "./routes/commentRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"

const app = express()

//middelwares
config()
app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())


// testing
app.get("/", (req, res) =>{
    res.send("We are Connected!")
})


// routings
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commetRoutes)


connectToDB()
app.listen(process.env.PORT, ()=>{
    console.log(`Server Started on http://localhost:${process.env.PORT}`)
})