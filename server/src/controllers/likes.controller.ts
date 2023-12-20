import express from "express";
import { getFavRecipes, getRecipeById } from "../models/recipe.model";
import { getUserById } from "../models/user.model";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";

export async function likeARecipe(req: express.Request, res: express.Response) {
	try {
		const { userId } = req.params;
		const { recipeId } = req.body;

		if (!recipeId) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Error: Something is missing.",
			});
		}

		const user = await getUserById(userId);
		if (user.likedRecipes.includes(recipeId)) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Recipe already liked by you.",
			});
		}
		user.likedRecipes.push(recipeId);
		await user.save();

		const recipe = await getRecipeById(recipeId);
		recipe.likes++;
		await recipe.save();

		res.status(statusCode.OK).send({
			message: "Recipe liked successfully",
			likedRecipes: user.likedRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
}

export async function unlikeARecipe(
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
		if (!user.likedRecipes.includes(recipeId)) {
			return res.status(statusCode.BAD_REQUEST).send({
				message: "Recipe is not liked by you.",
			});
		}

		user.likedRecipes = user.likedRecipes.filter(
			(item) => item.toString() !== recipeId
		);
		await user.save();

		const recipe = await getRecipeById(recipeId);
		recipe.likes--;
		await recipe.save();

		res.status(statusCode.OK).send({
			message: "Recipe unliked successfully",
			likedRecipes: user.likedRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
}

export async function favouriteARecipe(
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

export async function getFavRecipesByUser(
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
