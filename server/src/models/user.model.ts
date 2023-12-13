import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false },
	sessionToken: { type: String, select: false },
	// votedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
});

export const UserModel = mongoose.model("user", UserSchema); // "users" is the name of the collection

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

interface UpdateOptions {
	new?: boolean;
	runValidators?: boolean;
}

export const updateUserById = (
	id: string,
	values: Record<string, any>,
	options?: UpdateOptions
) => UserModel.findByIdAndUpdate(id, values, options);
