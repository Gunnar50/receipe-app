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
	image: { type: Buffer },
	password: { type: String, select: false, required: true },
	updated: { type: Date },
	createdAt: { type: Date, default: Date.now },
	likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
	savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
});

export const UserModel = mongoose.model("users", UserSchema);

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

export const removeRecipesFromUser = (id: string) => {
	return UserModel.updateMany(
		{ $or: [{ likedRecipes: id }, { savedRecipes: id }] },
		{ $pull: { likedRecipes: id, savedRecipes: id } }
	);
};
