import express from "express";
import { getUserBySessionToken } from "../models/user.model";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { AuthenticatedRequest } from "../utils/interfaces";

export async function isAuthenticated(
	req: AuthenticatedRequest,
	res: express.Response,
	next: express.NextFunction
) {
	try {
		// take the token from the cookies
		const sessionToken = req.cookies["sessionToken"];
		if (!sessionToken) {
			return res.status(statusCode.UNAUTHORIZED).send({
				message: "Unathorized.",
			});
		}

		// get an user using the token
		const user = await getUserBySessionToken(sessionToken);
		/**
		 * What you could do instead of getting the user from the session token is decoding the token
		 * and getting the user by ID. IRL, this is waaaay faster, safer, and better on the DB
		 * You're using Mongo, so the get by the ID will be faster than the sessionToken.
		 */
		if (!user) {
			return res.status(statusCode.UNAUTHORIZED).send({
				message: "Unathorized.",
			});
		}

		// add userId to the request for next function
		req.userId = user.id.toString();
		return next();
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong in our end.",
		});
	}
}

export async function isOwner(
	req: AuthenticatedRequest,
	res: express.Response,
	next: express.NextFunction
) {
	try {
		const { id } = req.params;
		// if you want to use this as a string, cast it to one
		// const currentUserId = req.userId as string;
		const currentUserId = req.userId;

		if (!currentUserId) {
			return res.status(statusCode.UNAUTHORIZED).send({
				message: "Unauthorized, please login.",
			});
		}

		if (currentUserId.toString() !== id) {
			return res.status(statusCode.UNAUTHORIZED).send({
				message: "Unauthorized request.",
			});
		}

		// Why did you return in the func above and not here? Just curious
		next();
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong in our end.",
		});
	}
}
