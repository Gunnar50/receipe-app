import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import authRouter from "../routes/auth.route";
import recipeRouter from "../routes/recipe.route";
import usersRouter from "../routes/users.route";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { formatError } from "../utils/inlineHandlers";

// set the .env location
// this is nescessary as we run tests from the root and run the server from the server folder.
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

// middlewares
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/recipes", recipeRouter);

// https://reflectoring.io/express-error-handling/ something like this for the generic handler at top level
// I overrided the onError function on the Express object on line 13. Normally, it'll just print the trace.
app.use(function onError(
	err: Error,
	_1: express.Request,
	res: express.Response,
	_2: express.NextFunction
) {
	return res.status(statusCode.BAD_REQUEST).send(formatError(err));
});

export default app;
