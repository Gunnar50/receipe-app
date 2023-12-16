import express from "express";
import { getUserBySessionToken } from "../models/user.model";

interface AuthenticatedRequest extends express.Request {
	userId: string;
}

export const isAuthenticated = async (
	req: AuthenticatedRequest,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		// take the token from the cookies
		const sessionToken = req.cookies["sessionToken"];
		if (!sessionToken) {
			return res.status(401).send({
				status: 0,
				message: "Unathorized.",
				type: "error",
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
			return res.status(403).send({
				status: 0,
				message: "Unathorized.",
				type: "error",
			});
		}

		// add userId to the request for next function
		req.userId = user._id.toString();
		// Same as before. Shouldn't be accessing private prop
		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
		});
	}
};

export const isOwner = async (
	req: AuthenticatedRequest,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const { id } = req.params;
		// if you want to use this as a string, cast it to one
		// const currentUserId = req.userId as string;
		const currentUserId = req.userId;

		if (!currentUserId) {
			return res.status(401).send({
				status: 0,
				message: "Unauthorized, please login.",
			});
		}

		if (currentUserId.toString() !== id) {
			return res.status(401).send({
				status: 0,
				message: "Unauthorized request.",
			});
		}

		// Why did you return in the func above and not here? Just curious
		next();
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
			type: "error",
		});
	}
};
