import mongoose from "mongoose";
import { UpdateOptions } from "../utils/interfaces";

const UserSchema = new mongoose.Schema({
	username: { type: String, required: "Username is required" },
	email: {
		type: String,
		required: "Email is required",
		unique: "Email already exists",
		match: [/.+\@.+\..+/, "Please fill a valid email address"],
	},
	password: { type: String, required: "Password is required" },
	sessionToken: { type: String, select: false },
	updated: Date,
	createdAt: { type: Date, default: Date.now },
	likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],

	// image: { type: String, required: "Image is required" },
});

export const UserModel = mongoose.model("User", UserSchema); // "users" is the name of the collection

export const getAllUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByUsername = (username: string) =>
	UserModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) =>
	UserModel.findOne({ sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
	new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
	UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (
	id: string,
	values: Record<string, any>,
	options?: UpdateOptions
) => UserModel.findByIdAndUpdate(id, values, options);
