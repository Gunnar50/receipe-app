import express from "express";
import {
	getLikedRecipes,
	getRecipeById,
	getSavedRecipes,
} from "../models/recipe.model";
import { getUserById } from "../models/user.model";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { tryPromise } from "../utils/inlineHandlers";

export async function likeARecipe(req: express.Request, res: express.Response) {
	const { userId } = req.params;
	const { recipeId } = req.body;

	// get the recipe
	const recipe = await tryPromise(getRecipeById(recipeId));
	if (recipe.error) {
		return res.status(statusCode.BAD_REQUEST).send({
			message: "Error: Something is missing.",
		});
	}

	// get the user
	const user = await tryPromise(getUserById(userId));
	if (user.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong while fetching the user.",
		});
	}

	let message = "";
	if (user.data.likedRecipes.includes(recipeId)) {
		// user already like this recipe but wants to unlike it.
		// unlike the recipe and remove from the liked list.
		user.data.likedRecipes = user.data.likedRecipes.filter(
			(item) => item.toString() !== recipeId
		);
		recipe.data.likes--;

		await user.data.save();
		await recipe.data.save();

		message = "Recipe unliked successfully.";
	} else {
		// user does not like the recipe and wish to like it.
		// add the recipe to the liked list
		user.data.likedRecipes.push(recipeId);
		recipe.data.likes++;

		await user.data.save();
		await recipe.data.save();

		message = "Recipe liked successfully";
	}

	return res.status(statusCode.OK).send({
		message,
		recipe: recipe.data,
	});
}

export async function getLikedRecipesIdByUser(
	req: express.Request,
	res: express.Response
) {
	const { userId } = req.params;

	const user = await tryPromise(getUserById(userId));
	if (user.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong while fetching the user.",
		});
	}

	res.status(statusCode.OK).send({
		likedRecipes: user.data.likedRecipes,
	});
}

export async function saveARecipe(req: express.Request, res: express.Response) {
	const { userId } = req.params;
	const { recipeId } = req.body;

	// get the recipe
	const recipe = await tryPromise(getRecipeById(recipeId));
	if (recipe.error) {
		return res.status(statusCode.BAD_REQUEST).send({
			message: "Error: Something is missing.",
		});
	}

	// get the user
	const user = await tryPromise(getUserById(userId));
	if (user.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong while fetching the user.",
		});
	}

	let message = "";
	if (user.data.savedRecipes.includes(recipeId)) {
		// user already like this recipe but wants to unlike it.
		// unlike the recipe and remove from the liked list.
		user.data.savedRecipes = user.data.savedRecipes.filter(
			(item) => item.toString() !== recipeId
		);

		await user.data.save();

		message = "Recipe unsaved successfully.";
	} else {
		// user does not like the recipe and wish to like it.
		// add the recipe to the liked list
		user.data.savedRecipes.push(recipeId);

		await user.data.save();

		message = "Recipe saved successfully";
	}

	return res.status(statusCode.OK).send({
		message,
		recipe: recipe.data,
	});
}

export async function getSavedRecipesIdByUser(
	req: express.Request,
	res: express.Response
) {
	const { userId } = req.params;

	const user = await tryPromise(getUserById(userId));
	if (user.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong while fetching the user.",
		});
	}

	res.status(statusCode.OK).send({
		savedRecipes: user.data.savedRecipes,
	});
}

export async function getSavedRecipesByUser(
	req: express.Request,
	res: express.Response
) {
	const { recipesIds } = req.body;

	const recipes = await tryPromise(getSavedRecipes(recipesIds));
	if (recipes.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong while fetching the recipes.",
		});
	}

	res.status(statusCode.OK).send({
		recipes: recipes.data,
	});
}
