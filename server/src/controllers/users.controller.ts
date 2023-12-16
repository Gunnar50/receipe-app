import express from "express";
import { generateHash } from "../utils/auth";

import {
	deleteUserById,
	getAllUsers,
	updateUserById,
} from "../models/user.model";

export const getUsers = async (req: express.Request, res: express.Response) => {
	try {
		const users = await getAllUsers();
		return res.status(200).send(users);
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
		});
	}
};

export const deleteUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		await deleteUserById(id);

		return res.status(200).send({
			status: 1,
			message: "User deleted successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
		});
	}
};

export const updateUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).send({
				status: 0,
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

		return res.status(200).send({
			status: 1,
			message: "User updated successfully.",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot find user.",
		});
	}
};
