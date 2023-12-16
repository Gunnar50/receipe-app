import express from "express";

import {
	createNewRecipe,
	deleteRecipeById,
	getRecipeById,
	getRecipes,
	getRecipesByUser,
	updateRecipeById,
} from "../models/recipe.model";
import { removeRecipesFromUser } from "../models/user.model";

export const createRecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id: owner } = req.params;
		const { title, ingredients, description, image, cookingTime } = req.body;

		if (!title || !ingredients || !description || !image || !cookingTime) {
			return res.status(400).send({
				status: 0,
				message: "Error: Something is missing.",
			});
		}

		const newRecipe = await createNewRecipe({
			title,
			ingredients,
			description,
			image,
			cookingTime,
			owner,
		});

		return res.status(200).send({
			status: 1,
			message: "Recipe created successfully.",
			newRecipe,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot create new recipe. Please try again later.",
		});
	}
};

export const getAllRecipes = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const recipes = await getRecipes();
		return res.status(200).send(recipes);
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get recipes. Please try again later.",
		});
	}
};

export const getOwnRecipes = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const recipes = await getRecipesByUser(id);
		return res.status(200).send(recipes);
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};

export const getSingleRecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const recipe = await getRecipeById(id);
		return res.status(200).send(recipe);
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};

export const deleteRecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { recipeId } = req.params;

		// delete the recipe from the database
		await deleteRecipeById(recipeId);

		// remove the recipe from any user's liked or fav array
		await removeRecipesFromUser(recipeId);

		return res.status(200).send({
			status: 1,
			message: "Recipe deleted successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};

export const updateRecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { recipeId } = req.params;
		const { title, ingredients, description, image, cookingTime } = req.body;

		if (!title || !ingredients || !description || !image || !cookingTime) {
			return res.status(400).send({
				status: 0,
				message: "Fields cannot be empty.",
			});
		}

		const recipe = await updateRecipeById(
			recipeId,
			{ title, ingredients, description, image, cookingTime },
			{
				new: true,
				runValidators: true,
			}
		);

		recipe.updated = new Date();
		await recipe.save();

		return res.status(200).send({
			status: 1,
			message: "Recipe updated successfully.",
			recipe,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};
