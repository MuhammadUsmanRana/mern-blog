import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

dotenv.config()
mongoose
    .connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("mongoDb connect");
    })
    .catch((err) => {
        console.log(err);
    });

    const __dirname = path.resolve();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/client/disk")));

app.get('*',(req, res) => {
    res.sendFile(path.join(__dirname, "client", "disc", "index.html"));
})

app.listen(3000, () => {
    console.log("server is running on port 3000!!!");
})

app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"
    res.json({
        statusCode,
        message
    });
});