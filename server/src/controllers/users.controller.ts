import express from "express";
import { generateHash } from "../utils/auth";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";

import {
	deleteUserById,
	getAllUsers,
	updateUserById,
} from "../models/user.model";
import { formatError, tryPromise, trySync } from "../utils/inlineHandlers";

export async function getUsers(_: express.Request, res: express.Response) {
	// Destructuring the returned object (it will always be a result type)
	const { data, error } = await tryPromise(getAllUsers());

	// if the error exists we handle it here. We return the 500 to the user
	if (error) {
		console.log(error);

		// error formatter to make things neater
		return res
			.status(statusCode.INTERNAL_SERVER_ERROR)
			.send(formatError(error));
	}

	return res.status(statusCode.OK).send(data);
}

export async function deleteUser(req: express.Request, res: express.Response) {
	const { userId } = req.params;
	const { data, error } = await tryPromise(deleteUserById(userId));

	if (error) {
		console.log(error);
		return res
			.status(statusCode.INTERNAL_SERVER_ERROR)
			.send(formatError(error));
	}

	return res.status(statusCode.OK).send({
		message: "User deleted successfully.",
		data,
	});
}

export async function updateUser(req: express.Request, res: express.Response) {
	const { userId } = req.params;
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(statusCode.BAD_REQUEST).send({
			message: "Fields cannot be empty.",
		});
	}

	// Little bit of a cheeky hack. Because we take a function object in, we kinda have to use
	// an arrow function here. Because Arrow functions don't create lexical scope, we don't
	// need to take in any params to get this to work at all.

	const hashedPasswordResult = trySync<string>(() => generateHash(password));

	// Might be worth looking into how typescript type args work. You could do some funkiness
	// with any here to not have to use the arrow function. But, the point of the function is
	// to run a block of syncronous code and make sure the result is the right type (or hold an error)
	// So I don't completely hate this. Have a play about and see what works for you

	if (hashedPasswordResult.error) {
		return res
			.status(statusCode.INTERNAL_SERVER_ERROR)
			.send(formatError(hashedPasswordResult.error));
	}

	const updatedUser = await tryPromise(
		updateUserById(
			userId,
			{ username, password: hashedPasswordResult.data },
			{ new: true, runValidators: true }
		)
	);

	if (updatedUser.error) {
		return res
			.status(statusCode.NOT_FOUND)
			.send(formatError(updatedUser.error));
	}

	updatedUser.data.updated = new Date();
	const { error } = await tryPromise(updatedUser.data.save());

	if (error) throw error;

	if (error) {
		return res
			.status(statusCode.INTERNAL_SERVER_ERROR)
			.send(formatError(error));
	}

	return res.status(statusCode.OK).send({
		message: "User updated successfully.",
		updatedUser,
	});
}
