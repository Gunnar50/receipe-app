import express from "express";

import { createUser, getUserByEmail } from "../models/user.model";
import { generateHash } from "../utils/auth";

/**
 * Don't use arrow functions like this. Regular functions are much better and create a function object with its own
 * 'this'. Currently, if you use this inside your func, you'll get weird results (in the browser, this will be the Window.
 * on a node server, it'll be the node process 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
 */
export const loginUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		/**
		 * Love the use of destructuring. Might be worth performing validation on the inputs using something like Zod
		 * https://github.com/colinhacks/zod?tab=readme-ov-file#objects:~:text=%3B%20//%20true-,Objects,-//%20all%20properties%20are
		 * 
		 * Would mean you can make the if statement a bit nicer and leads to you being able to make a generic error handler based
		 * on input validation
		 */
		const { email, password } = req.body;

		if (!email || !password) {
			// prefer built in constants rather than hard coded numbers 
			// change 400 to HttpStatusCode.BadRequest
			// Errata - use this https://stackoverflow.com/questions/18765869/accessing-http-status-code-constants#:~:text=Status%20numeric%20value.-,Example%3A%20TypeScript,-Constants.ts
			// Turns out HttpStatusCode is part of axios which I had installed globally somehow
			return res.status(400).send({
				status: 0, // Why are we setting status 0 when we set it on the res object? I think this includes it in the response body
				message: "Email or Password incorrect.", // if you use Zod, it will handle this for you + you can do custom messages
			});
		}

		const user = await getUserByEmail(email).select("+password");
		if (!user) {
			// prefer built in constants rather than hard coded numbers 
			// change 403 to HttpStatusCode.Forbidden
			return res.status(403).send({
				status: 0,
				message: "Email or Password incorrect.",
			});
		}

		const hashedPassword = generateHash(password); 

		if (user.password !== hashedPassword) {
			return res.status(403).send({
				status: 0,
				message: "Email or Password incorrect.",
			});
		}

		// if the property has an underscore, it's private. Why are you reading it?
		// if it should be public, remove the underscore
		user.sessionToken = generateHash(user._id.toString());

		// I would advise not saving session tokens in the database like this.
		// if you want to persist them, I'd suggest another table. 
		await user.save();

		res.cookie("sessionToken", user.sessionToken, {
			domain: "localhost",
			path: "/",
			// expires: new Date(Date.now() + 9999), I guess you're coming back here to uncomment this? Was it not working?
		});

		return res.status(200).send({
			status: 1,
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
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
		});
	}
};

/**
 * unused param can be changed to an underscore. Signals to other devs that it isn't used at all
 */
export const logoutUser = async (
	req: express.Request,
	res: express.Response
) => {
	// definitely no error possible here. If the cookie doesn't exist, it just continues doing stuff.
	// I'd take out the try catch to simplify things
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
		/** same advise as above with Zod. How do you validate a user's password length/ safety? 
		*/
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
				message: "Email already registered. Please login.",
			});
		}

		const hashedPassword = generateHash(password);

		const newUser = await createUser({
			email,
			username,
			password: hashedPassword,
		});

		return res.status(200).send({
			status: 1,
			message: "User registered successfully.",
			newUser,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong on our end.",
		});
	}
};
