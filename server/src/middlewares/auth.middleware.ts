import express from "express";
import { deleteSession, getSessionById } from "../models/session.model";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { Try, formatError, tryPromise } from "../utils/inlineHandlers";
import { AuthenticatedRequest } from "../utils/interfaces";

// 15 minutes
const sessionAddedTime: number = 1000 * 60 * 15;

// this middleware is to check if a user is authenticated in general.
export async function isAuthenticated(
	req: AuthenticatedRequest,
	res: express.Response,
	next: express.NextFunction
) {
	// take the token from the cookies
	const sessionToken: string = req.cookies["sessionToken"];

	if (!sessionToken) {
		return res.status(statusCode.UNAUTHORIZED).send({
			message: "Unathorized.",
		});
	}

	// try to find the corresponding token in the database
	const currentSession = await tryPromise(getSessionById(sessionToken));

	// if the error is not null
	if (currentSession.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong",
			errors: formatError(currentSession.error),
		});
	}

	// if the error is null and the data is null
	if (!currentSession.data) {
		return res.status(statusCode.UNAUTHORIZED).send({
			message: "Unathorized.",
		});
	}

	// check if the session is expired
	const now: Date = new Date();
	if (currentSession.data.expireAt < now) {
		const { error } = await tryPromise(deleteSession(sessionToken));
		if (error) {
			return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				message: "Something went wrong when deleting the session.",
				errors: formatError(error),
			});
		}

		res.clearCookie("sessionToken");
		return res.status(statusCode.UNAUTHORIZED).send({
			message: "Session expired. Please login.",
		});
	}

	// const oneHourFromNow: Date = new Date(now.getTime() + 60 * 60 * 1000);
	// if (currentSession.data.expireAt < oneHourFromNow) {
	// 	// if has less than 1 hour remaining, extend by 15 minutes
	// 	currentSession.data.expireAt = new Date(
	// 		currentSession.data.expireAt.getTime() + sessionAddedTime
	// 	);
	// 	const { error } = await tryPromise(currentSession.data.save());
	// 	if (error) {
	// 		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
	// 			message: "Something went wrong",
	// 			errors: formatError(error),
	// 		});
	// 	}
	// }

	// add userId to the request for next function
	req.userId = currentSession.data.userId.toString();

	return next();
}

// this middleware is to allow the user to access their own data
export async function isOwner(
	req: AuthenticatedRequest,
	res: express.Response,
	next: express.NextFunction
) {
	const { userId } = req.params;

	const currentUserId: string = req.userId as string;

	if (currentUserId !== userId) {
		return res.status(statusCode.UNAUTHORIZED).send({
			message: "Unauthorized request.",
		});
	}

	return next();
}
