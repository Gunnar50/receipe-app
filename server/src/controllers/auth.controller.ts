import express from "express";
import { ZodError } from "zod";
import { createUser, getUserByEmail } from "../models/user.model";
import { generateHash } from "../utils/auth";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { loginSchema, signupSchema } from "../utils/zodSchemas";

export async function loginUser(req: express.Request, res: express.Response) {
	try {
		const { email, password } = req.body;

		const validation = loginSchema.safeParse({ email, password });

		if (!validation.success) {
			// hacky way of checking the error
			// typescript did not let me do "validation.error" (?) dont know why
			const errorResult = validation as unknown as { error: ZodError };

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
			return res.status(403).send({
				message: "Email or Password incorrect.",
			});
		}

		user.sessionToken = generateHash(user.id.toString());

		// I would advise not saving session tokens in the database like this.
		// if you want to persist them, I'd suggest another table.
		await user.save();

		res.cookie("sessionToken", user.sessionToken, {
			domain: "localhost",
			path: "/",
			// expires: new Date(Date.now() + 9999), I guess you're coming back here to uncomment this? Was it not working?
		});

		return res.status(statusCode.OK).send({
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
			status: 0,
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
			// hacky way of checking the error
			// typescript did not let me do "validation.error" (?) dont know why
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

		return res.status(statusCode.OK).send({
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
