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
		if (!user) {
			return res.status(403).send({
				status: 0,
				message: "Unathorized.",
				type: "error",
			});
		}

		// add userId to the request for next function
		req.userId = user._id.toString();
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
