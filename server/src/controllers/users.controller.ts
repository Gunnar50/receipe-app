import express from "express";

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
			type: "error",
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
			type: "success",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
			type: "error",
		});
	}
};

export const updateUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { username, email, password } = req.body;
		const { id } = req.params;

		if (!username || !email || !password) {
			return res.status(400).send({
				status: 0,
				message: "Fields cannot be empty.",
			});
		}

		const user = await updateUserById(
			id,
			{ username, email, password },
			{
				new: true,
				runValidators: true,
			}
		);

		return res.status(200).send({
			status: 1,
			message: "User updated successfully.",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong in our end.",
		});
	}
};
