import mongoose from "mongoose";
import { UpdateOptions } from "../utils/interfaces";

const RecipeSchema = new mongoose.Schema({
	title: { type: String, required: "Title is required" },
	ingredients: [
		{ type: String, required: "At least one ingredient is required" },
	],
	description: { type: String, required: "Description is required" },
	image: { type: String, required: "Image is required" },
	// image: { data: Buffer, contentType: String },
	cookingTime: { type: Number, required: "Cooking time is required" },
	updated: Date,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		require: true,
	},
	likes: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
	// comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
});

export const RecipeModel = mongoose.model("Recipe", RecipeSchema);

export const getRecipes = () =>
	RecipeModel.find().populate("owner", "username").exec();

export const getRecipeById = (id: string) =>
	RecipeModel.findById(id).populate("owner", "username").exec();

export const getRecipesByUser = (id: string) =>
	RecipeModel.find({ owner: id }).populate("owner", "username").exec();

export const deleteRecipeById = (id: string) =>
	RecipeModel.findByIdAndDelete(id);

export const updateRecipeById = (
	id: string,
	values: Record<string, any>,
	options?: UpdateOptions
) => RecipeModel.findByIdAndUpdate(id, values, options);

export const createNewRecipe = (values: Record<string, any>) =>
	new RecipeModel(values).save().then((recipe) => recipe.toObject());
