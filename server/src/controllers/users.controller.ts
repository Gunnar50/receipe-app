import express from "express";
import { generateHash } from "../utils/auth";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";

import {
	deleteUserById,
	getAllUsers,
	updateUserById,
	UserModel,
} from "../models/user.model";
import { tryPromise, formatError, trySync } from "utils/inlineHandlers";

export async function getUsers(_: express.Request, res: express.Response) {
	// Destructuring the returned object (it will always be a result type)
	const {data, error} = await tryPromise(getAllUsers());

	// if the error exists we handle it here. We return the 500 to the user
	if (error) {
		console.log(error);

		// error formatter to make things neater
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send(formatError(error));
	}

	return res.status(statusCode.OK).send(data);
}

export async function deleteUser(req: express.Request, res: express.Response) {
	try {
		const { id } = req.params;
		await deleteUserById(id);

		return res.status(statusCode.OK).send({
			message: "User deleted successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong in our end.",
		});
	}
}

export async function updateUser(req: express.Request, res: express.Response) {
	const { id } = req.params;
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(statusCode.BAD_REQUEST).send({
			message: "Fields cannot be empty.",
		});
	}

	// Little bit of a cheeky hack. Because we take a function object in, we kinda have to use
	// an arrow function here. Because Arrow functions don't create lexical scope, we don't
	// need to take in any params to get this to work at all.

	const hasedPasswordResult = trySync<string>(() => generateHash(password));

	// Might be worth looking into how typescript type args work. You could do some funkiness
	// with any here to not have to use the arrow function. But, the point of the function is
	// to run a block of syncronous code and make sure the result is the right type (or hold an error)
	// So I don't completely hate this. Have a play about and see what works for you

	if (hasedPasswordResult.error) {
		return res
			.status(statusCode.INTERNAL_SERVER_ERROR)
			.send(formatError(hasedPasswordResult.error))
	}

	const user = await tryPromise<typeof UserModel>(updateUserById(
		id,
		{ username, password: hasedPasswordResult.data },
		{
			new: true,
			runValidators: true,
		}
	));

	if (user.error) {
		return res.status(statusCode.NOT_FOUND).send(formatError(user.error));
	}

	user.data.updated = new Date();
	const {error} = await tryPromise(user.data.save());

	if (error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send(formatError(error))
	}

	return res.status(statusCode.OK).send({
		message: "User updated successfully.",
		user,
	});
}
