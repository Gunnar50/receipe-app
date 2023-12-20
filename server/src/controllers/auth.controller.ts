import express from "express";
import { ZodError } from "zod";
import { createNewSession, getSessionByUserId } from "../models/session.model";
import { createUser, getUserByEmail } from "../models/user.model";
import { generateHash } from "../utils/auth";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { loginSchema, signupSchema } from "../utils/zodSchemas";

export async function loginUser(req: express.Request, res: express.Response) {
	try {
		const { email, password } = req.body;

		const validation = loginSchema.safeParse({ email, password });

		if (!validation.success) {
			const errorResult = validation as { error: ZodError };

			return res.status(statusCode.BAD_REQUEST).send({
				message: "Validation error",
				errors: errorResult.error.issues,
			});
		}

		const user = await getUserByEmail(email).select("+password");
		if (!user) {
			return res.status(statusCode.FORBIDDEN).send({
				message: "Email or Password incorrect.",
			});
		}

		const hashedPassword = generateHash(password);

		if (user.password !== hashedPassword) {
			return res.status(statusCode.FORBIDDEN).send({
				message: "Email or Password incorrect.",
			});
		}

		// user.sessionToken = generateHash(user._id.toString());

		// create a new session that expires in two hours
		const currentSession = await createNewSession({
			expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
			userId: user._id,
		});

		// I would advise not saving session tokens in the database like this.
		// if you want to persist them, I'd suggest another table.
		// await user.save();

		res.cookie("sessionToken", currentSession._id, {
			domain: "localhost",
			path: "/",
		});

		return res.status(statusCode.OK).send({
			sessionToken: user.sessionToken,
			message: "Logged in successfully.",
		});
		/**
		 * What can throw an error in all of this? If any of the functions are yours I'd suggest adding a throws tag.
		 * I added a docblock with one to generatehash. You could also make the return a union. I did this too.
		 *
		 * https://www.tutorialsteacher.com/typescript/typescript-never
		 */
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong in our end.",
		});
	}
}

export async function logoutUser(_: express.Request, res: express.Response) {
	res.clearCookie("sessionToken");
	return res.status(statusCode.OK).send({
		message: "Logged out successfully.",
	});
}

export async function signUpUser(req: express.Request, res: express.Response) {
	try {
		const { email, password, username } = req.body;

		const validation = signupSchema.safeParse({ email, password, username });

		if (!validation.success) {
			const errorResult = validation as unknown as { error: ZodError };

			return res.status(statusCode.BAD_REQUEST).send({
				message: "Validation error",
				errors: errorResult.error.issues,
			});
		}

		if (await getUserByEmail(email)) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Email already registered. Please login.",
			});
		}

		const hashedPassword = generateHash(password);

		const newUser = await createUser({
			email,
			username,
			password: hashedPassword,
		});

		return res.status(statusCode.CREATED).send({
			message: "User registered successfully.",
			newUser,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			status: 0,
			message: "Error: Something went wrong on our end.",
		});
	}
}
