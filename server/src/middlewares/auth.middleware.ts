import express from "express";
import { deleteSession, getSessionById } from "../models/session.model";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { AuthenticatedRequest } from "../utils/interfaces";

// 15 minutes
const sessionAddedTime = 1000 * 60 * 15;

// this middleware is to check if a user is authenticated in general.
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
		// const user = await getUserBySessionToken(sessionToken);

		// try to find the corresponding token in the database
		const currentSession = await getSessionById(sessionToken);
		if (!currentSession) {
			return res.status(statusCode.UNAUTHORIZED).send({
				message: "Unathorized.",
			});
		}

		const now = new Date();
		if (currentSession.expireAt < now) {
			await deleteSession(sessionToken);
			return res.status(statusCode.UNAUTHORIZED).send({
				message: "Session expired. Please login.",
			});
		}

		const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
		if (currentSession.expireAt < oneHourFromNow) {
			// if has less than 1 hour remaining, extend by 15 minutes
			currentSession.expireAt = new Date(
				currentSession.expireAt.getTime() + sessionAddedTime
			);
			await currentSession.save();
		}

		/**
		 * What you could do instead of getting the user from the session token is decoding the token
		 * and getting the user by ID. IRL, this is waaaay faster, safer, and better on the DB
		 * You're using Mongo, so the get by the ID will be faster than the sessionToken.
		 */
		// if (!user) {
		// 	return res.status(statusCode.UNAUTHORIZED).send({
		// 		message: "Unathorized.",
		// 	});
		// }

		// add userId to the request for next function
		req.userId = currentSession.userId.toString();
		return next();
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong in our end.",
		});
	}
}

// this middleware is to allow the user to access their own data
export async function isOwner(
	req: AuthenticatedRequest,
	res: express.Response,
	next: express.NextFunction
) {
	try {
		const { userId } = req.params;
		// if you want to use this as a string, cast it to one
		// const currentUserId = req.userId as string;
		const currentUserId = req.userId as string;

		if (currentUserId !== userId) {
			return res.status(statusCode.UNAUTHORIZED).send({
				message: "Unauthorized request.",
			});
		}

		return next();
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong in our end.",
		});
	}
}
