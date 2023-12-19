import express from "express";
import { generateHash } from "../utils/auth";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";

import {
	deleteUserById,
	getAllUsers,
	updateUserById,
} from "../models/user.model";

// What's the point of the users controller? Aren't user operations handled by auth?
export async function getUsers(_: express.Request, res: express.Response) {
	try {
		const users = await getAllUsers();
		return res.status(statusCode.OK).send(users);
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong in our end.",
		});
	}
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
	try {
		const { id } = req.params;
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Fields cannot be empty.",
			});
		}

		const hasedPassword = generateHash(password);

		const user = await updateUserById(
			id,
			{ username, password: hasedPassword },
			{
				new: true,
				runValidators: true,
			}
		);

		user.updated = new Date();
		await user.save();

		return res.status(statusCode.OK).send({
			message: "User updated successfully.",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot find user.",
		});
	}
}
