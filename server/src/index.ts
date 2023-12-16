import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import recipeRouter from "./routes/recipe.route";
import usersRouter from "./routes/users.route";

dotenv.config();
const app = express();

// middlewares
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/recipes", recipeRouter);

// mongodb connection
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("error", (error: Error) => console.log(error));

// Like this set up 👍🏾
const server = http.createServer(app);
const port = 6001 || process.env.PORT;
server.listen(6001, () => {
	console.log("Server running on port:", port);
});
