import express from "express";
import {
	getFavRecipes,
	getLikedRecipes,
	getRecipeById,
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
	});
}

export async function getLikedRecipesByUser(
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
	const likedRecipes = await tryPromise(getLikedRecipes(user.data.favRecipes));
	if (likedRecipes.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong while getting the liked recipes.",
		});
	}

	res.status(statusCode.OK).send({
		likedRecipes: likedRecipes.data,
	});
}

export async function saveARecipe(req: express.Request, res: express.Response) {
	try {
		const { userId } = req.params;
		const { recipeId } = req.body;

		if (!recipeId) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Error: Something is missing.",
			});
		}

		const user = await getUserById(userId);
		if (user.favRecipes.includes(recipeId)) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Recipe is already in your favourites.",
			});
		}
		user.favRecipes.push(recipeId);
		await user.save();

		res.status(statusCode.OK).send({
			message: "Recipe added to favourites successfully",
			favRecipes: user.favRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
}

export async function unfavouriteARecipe(
	req: express.Request,
	res: express.Response
) {
	try {
		const { userId } = req.params;
		const { recipeId } = req.body;

		if (!recipeId) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Error: Something is missing.",
			});
		}

		const user = await getUserById(userId);
		if (!user.favRecipes.includes(recipeId)) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Recipe is not in your favourites.",
			});
		}
		user.favRecipes = user.favRecipes.filter(
			(item) => item.toString() !== recipeId
		);
		await user.save();

		res.status(statusCode.OK).send({
			message: "Recipe removed from favourites successfully",
			favRecipes: user.favRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
}

export async function getSavedRecipesByUser(
	req: express.Request,
	res: express.Response
) {
	try {
		const { userId } = req.params;

		const user = await getUserById(userId);
		const favRecipes = await getFavRecipes(user.favRecipes);

		res.status(statusCode.OK).send({
			favRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Something went wrong.",
		});
	}
}
