import mongoose from "mongoose";
import { UpdateOptions } from "../utils/interfaces";

export type RecipeType = {
	_id: mongoose.Types.ObjectId;
	title: string;
	ingredients: string[];
	description: string;
	image: string;
	cookingTime: number;
	updated?: Date;
	owner: mongoose.Types.ObjectId;
	likes: number;
	serves: number;
	category: string;
	createdAt: Date;
};

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
	serves: { type: Number, required: "Number of servings is required" },
	category: {
		type: String,
		required: "Category is required. (Cakes, Pastry, Pasta...)",
	},
	createdAt: { type: Date, default: Date.now },
});

export const RecipeModel = mongoose.model("recipes", RecipeSchema);

export const getRecipes = () =>
	RecipeModel.find().populate("owner", "username").exec();

export const getRecipeById = (id: string) =>
	RecipeModel.findById(id).populate("owner", "username").exec();

export const getSavedRecipes = (savedRecipes: mongoose.Types.ObjectId[]) =>
	RecipeModel.find({ _id: { $in: savedRecipes } })
		.populate("owner", "username")
		.exec();

export const getLikedRecipes = (likedRecipes: mongoose.Types.ObjectId[]) =>
	RecipeModel.find({ _id: { $in: likedRecipes } })
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

export const createNewRecipe = (
	values: Record<string, any>
): Promise<RecipeType> =>
	new RecipeModel(values).save().then((recipe) => recipe.toObject());
