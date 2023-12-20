import express from "express";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";

import {
	createNewRecipe,
	deleteRecipeById,
	getRecipeById,
	getRecipes,
	getRecipesByUser,
	updateRecipeById,
} from "../models/recipe.model";
import { removeRecipesFromUser } from "../models/user.model";

export async function createRecipe(
	req: express.Request,
	res: express.Response
) {
	try {
		const { userId: owner } = req.params;
		const { title, ingredients, description, image, cookingTime } = req.body;

		if (!title || !ingredients || !description || !image || !cookingTime) {
			return res.status(statusCode.BAD_REQUEST).send({
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

		return res.status(statusCode.OK).send({
			message: "Recipe created successfully.",
			newRecipe,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot create new recipe. Please try again later.",
		});
	}
}

export async function getAllRecipes(
	req: express.Request,
	res: express.Response
) {
	try {
		const recipes = await getRecipes();
		return res.status(statusCode.OK).send(recipes);
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot get recipes. Please try again later.",
		});
	}
}

export async function getOwnRecipes(
	req: express.Request,
	res: express.Response
) {
	try {
		const { userId } = req.params;
		const recipes = await getRecipesByUser(userId);
		return res.status(statusCode.OK).send(recipes);
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
}

export async function getSingleRecipe(
	req: express.Request,
	res: express.Response
) {
	try {
		const { id } = req.params;
		const recipe = await getRecipeById(id);
		return res.status(statusCode.OK).send(recipe);
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
}

export async function deleteRecipe(
	req: express.Request,
	res: express.Response
) {
	try {
		const { recipeId } = req.params;

		// delete the recipe from the database
		await deleteRecipeById(recipeId);

		// remove the recipe from any user's liked or fav array
		await removeRecipesFromUser(recipeId);

		return res.status(statusCode.OK).send({
			message: "Recipe deleted successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
}

export async function updateRecipe(
	req: express.Request,
	res: express.Response
) {}
