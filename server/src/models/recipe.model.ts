import mongoose from "mongoose";
import { UpdateOptions } from "../utils/interfaces";

const RecipeSchema = new mongoose.Schema({
	title: { type: String, required: "Title is required" },
	ingredients: [
		{ type: String, required: "At least one ingredient is required" },
	],
	description: { type: String, required: "Description is required" },
	image: { type: String, required: "Image is required" }, // this will change to buffer later. string only for testing
	cookingTime: { type: Number, required: "Cooking time is required" },
	updated: Date,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		require: true,
	},
	likes: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

export const RecipeModel = mongoose.model("recipes", RecipeSchema);

export const getRecipes = () =>
	RecipeModel.find().populate("owner", "username").exec();

export const getRecipeById = (id: string) =>
	RecipeModel.findById(id).populate("owner", "username").exec();

export const getFavRecipes = (votedRecipes: mongoose.Types.ObjectId[]) =>
	RecipeModel.findById({ _id: { $in: votedRecipes } })
		.populate("owner", "username")
		.exec();

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
