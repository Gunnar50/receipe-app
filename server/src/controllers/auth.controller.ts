import express from "express";

import { createUser, getUserByEmail } from "../models/user.model";
import { generateHash } from "../utils/auth";

export const loginUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).send({
				status: 0,
				message: "Email or Password incorrect.",
			});
		}

		const user = await getUserByEmail(email).select("+password");
		if (!user) {
			return res.status(403).send({
				status: 0,
				message: "Email or Password incorrect.",
			});
		}

		const hasedPassword = generateHash(password);

		if (user.password !== hasedPassword) {
			return res.status(403).send({
				status: 0,
				message: "Email or Password incorrect.",
			});
		}

		user.sessionToken = generateHash(user._id.toString());
		await user.save();

		res.cookie("sessionToken", user.sessionToken, {
			domain: "localhost",
			path: "/",
			// expires: new Date(Date.now() + 9999),
		});

		return res.status(200).send({
			status: 1,
			message: "Logged in successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
		});
	}
};

export const logoutUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		res.clearCookie("sessionToken");
		return res.status(200).send({
			status: 1,
			message: "Logged out successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
		});
	}
};

export const signUpUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { email, username, password } = req.body;

		if (!email || !username || !password) {
			return res.status(400).send({
				status: 0,
				message: "Error: Something is missing.",
			});
		}

		if (await getUserByEmail(email)) {
			return res.status(400).send({
				status: 0,
				message: "Could not complete the registration. Please try again.",
			});
		}

		const hashedPassword = generateHash(password);

		await createUser({
			email,
			username,
			password: hashedPassword,
		});

		return res.status(200).send({
			status: 1,
			message: "User registered successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong on our end.",
		});
	}
};
