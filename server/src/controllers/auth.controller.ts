import express from "express";
import { ZodError } from "zod";
import {
	createNewSession,
	deleteSession,
	getSessionByUserId,
} from "../models/session.model";
import { createUser, getUserByEmail } from "../models/user.model";
import { generateHash } from "../utils/auth";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { formatError, tryPromise, trySync } from "../utils/inlineHandlers";
import { loginSchema, signupSchema } from "../utils/zodSchemas";

export async function loginUser(req: express.Request, res: express.Response) {
	// extract only email and password from the body
	const { email, password } = req.body;

	// make sure email and password are valid
	const validation = loginSchema.safeParse({ email, password });
	if (!validation.success) {
		const errorResult = validation as { error: ZodError };

		return res.status(statusCode.BAD_REQUEST).send({
			message: errorResult.error.issues.map((err) => err.message),
			errors: errorResult.error.issues,
		});
	}

	// get the corresponding user from the email
	const user = await tryPromise(getUserByEmail(email).select("+password"));

	// something went wrong when getting the user
	if (user.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong. Please try again.",
		});
	}

	// if no error but data is null, it means this user is not registered
	if (!user.data) {
		// sending forbidden and not "not found" for security reasons
		return res.status(statusCode.FORBIDDEN).send({
			// send email or password incorrect for security reasons
			message: "Email or Password incorrect.",
		});
	}

	// hash the password to compare with the database password
	const hashedPasswordResult = trySync<string>(() => generateHash(password));
	if (hashedPasswordResult.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong. Please try again.",
			errors: formatError(hashedPasswordResult.error),
		});
	}

	// if the passwords dont match, send forbidden
	if (user.data.password !== hashedPasswordResult.data) {
		return res.status(statusCode.FORBIDDEN).send({
			// we still send email or password incorrect for security reasons
			message: "Email or Password incorrect.",
		});
	}

	// try getting a session from this user, if it exists that means the user is already logged in
	// just send them back the session token
	const currentSession = await tryPromise(
		getSessionByUserId(user.data._id.toString())
	);

	// create a new session for this user that expires in two hours
	const sessionExpireDate = new Date(Date.now() + 1000 * 60 * 60 * 2);
	// add 30sec for testing purposes
	// const sessionExpireDate = new Date(Date.now() + 1000 * 30);
	const newSession = await tryPromise(
		createNewSession({
			expireAt: sessionExpireDate,
			userId: user.data._id,
		})
	);

	// save the session to a cookie
	res.cookie(
		"sessionToken",
		currentSession.data
			? currentSession.data._id.toString()
			: newSession.data._id.toString(),
		{
			domain: "localhost",
			path: "/",
			expires: sessionExpireDate,
			httpOnly: true, // cookie only sent in http requests
		}
	);

	// send OK back with the session token and a successfull message
	return res.status(statusCode.OK).send({
		userId: user.data._id,
		username: user.data.username,
		message: "Logged in successfully.",
	});
}

export async function logoutUser(req: express.Request, res: express.Response) {
	const { userId } = req.params;

	const currentSession = await tryPromise(getSessionByUserId(userId));
	// this shouldn't happen, it only happen if the user is not logged in and tries to logout.
	// and user wouldnt be able to get to this route without going through the auth middleware
	// which requires the userId and the user to be logged in
	// could happen in testing (?)
	if (currentSession.error) {
		return res
			.status(statusCode.NOT_FOUND)
			.send(formatError(currentSession.error));
	}

	// delete the session from the database
	const { error } = await tryPromise(
		deleteSession(currentSession.data._id.toString())
	);
	if (error) {
		return res
			.status(statusCode.INTERNAL_SERVER_ERROR)
			.send(formatError(error));
	}

	// remove the session from the cookies
	res.clearCookie("sessionToken");
	return res.status(statusCode.OK).send({
		message: "Logged out successfully.",
	});
}

export async function signUpUser(req: express.Request, res: express.Response) {
	const { email, password, username } = req.body;

	const validation = signupSchema.safeParse({ email, password, username });

	if (!validation.success) {
		const errorResult = validation as unknown as { error: ZodError };

		return res.status(statusCode.BAD_REQUEST).send({
			message: errorResult.error.issues.map((err) => err.message),
			errors: errorResult.error.issues,
		});
	}

	// get the corresponding user from the email
	const user = await tryPromise(getUserByEmail(email));

	// something went wrong when getting the user
	if (user.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong. Please try again.",
			errors: formatError(user.error),
		});
	}

	// if no error but data is null, it means this user is already registered
	if (user.data) {
		return res.status(statusCode.BAD_REQUEST).send({
			message: "Email already registered. Please login.",
		});
	}

	// hash the password to compare with the database password
	const hashedPasswordResult = trySync<string>(() => generateHash(password));
	if (hashedPasswordResult.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong. Please try again.",
			errors: formatError(hashedPasswordResult.error),
		});
	}

	const newUser = await tryPromise(
		createUser({
			email,
			username,
			password: hashedPasswordResult.data,
		})
	);

	if (newUser.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong. Please try again.",
			errors: formatError(newUser.error),
		});
	}

	return res.status(statusCode.CREATED).send({
		message: "User registered successfully.",
		newUser: newUser.data,
	});
}

export async function validateSession(
	req: express.Request,
	res: express.Response
) {
	return res
		.status(statusCode.OK)
		.send({ message: "Valid session", isValid: true });
}
