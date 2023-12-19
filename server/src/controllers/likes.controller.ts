import express from "express";
import { getFavRecipes, getRecipeById } from "../models/recipe.model";
import { getUserById } from "../models/user.model";

export const likeARecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const { recipeId } = req.body;

		if (!recipeId) {
			return res.status(400).send({
				status: 0,
				message: "Error: Something is missing.",
			});
		}

		const user = await getUserById(id);
		if (user.likedRecipes.includes(recipeId)) {
			return res.status(400).send({
				status: 0,
				message: "Recipe already liked by you.",
			});
		}
		user.likedRecipes.push(recipeId);
		await user.save();

		const recipe = await getRecipeById(recipeId);
		recipe.likes++;
		await recipe.save();

		res.status(200).send({
			status: 1,
			message: "Recipe liked successfully",
			likedRecipes: user.likedRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};

export const unlikeARecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const { recipeId } = req.body;

		if (!recipeId) {
			return res.status(400).send({
				status: 0,
				message: "Error: Something is missing.",
			});
		}

		const user = await getUserById(id);
		if (!user.likedRecipes.includes(recipeId)) {
			return res.status(400).send({
				status: 0,
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

		res.status(200).send({
			status: 1,
			message: "Recipe unliked successfully",
			likedRecipes: user.likedRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};

export const favouriteARecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const { recipeId } = req.body;

		if (!recipeId) {
			return res.status(400).send({
				status: 0,
				message: "Error: Something is missing.",
			});
		}

		const user = await getUserById(id);
		if (user.favRecipes.includes(recipeId)) {
			return res.status(400).send({
				status: 0,
				message: "Recipe is already in your favourites.",
			});
		}
		user.favRecipes.push(recipeId);
		await user.save();

		res.status(200).send({
			status: 1,
			message: "Recipe added to favourites successfully",
			favRecipes: user.favRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};

export const unfavouriteARecipe = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const { recipeId } = req.body;

		if (!recipeId) {
			return res.status(400).send({
				status: 0,
				message: "Error: Something is missing.",
			});
		}

		const user = await getUserById(id);
		if (!user.favRecipes.includes(recipeId)) {
			return res.status(400).send({
				status: 0,
				message: "Recipe is not in your favourites.",
			});
		}
		user.favRecipes = user.favRecipes.filter(
			(item) => item.toString() !== recipeId
		);
		await user.save();

		res.status(200).send({
			status: 1,
			message: "Recipe removed from favourites successfully",
			favRecipes: user.favRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Cannot get user recipe. Please try again later.",
		});
	}
};

export const getFavRecipesByUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;

		const user = await getUserById(id);
		const favRecipes = await getFavRecipes(user.favRecipes);

		res.status(200).send({
			status: 1,
			favRecipes,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: 0,
			message: "Error: Something went wrong.",
		});
	}
};
