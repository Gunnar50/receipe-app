import express from "express";
import { ZodError } from "zod";
import {
	createNewRecipe,
	deleteRecipeById,
	getRecipeById,
	getRecipes,
	getRecipesByUser,
	updateRecipeById,
} from "../models/recipe.model";
import { removeRecipesFromUser } from "../models/user.model";
import { HTTP_STATUS as statusCode } from "../utils/httpStatus";
import { formatError, tryPromise } from "../utils/inlineHandlers";
import { recipeSchema } from "../utils/zodSchemas";

export async function createRecipe(
	req: express.Request,
	res: express.Response
) {
	const { userId: owner } = req.params;
	const { title, ingredients, description, image, cookingTime } = req.body;

	const validation = recipeSchema.safeParse({
		title,
		ingredients,
		description,
		image,
		cookingTime,
	});
	if (!validation.success) {
		const errorResult = validation as { error: ZodError };

		return res.status(statusCode.BAD_REQUEST).send({
			message: errorResult.error.issues.map((err) => err.message),
			errors: errorResult.error.issues,
		});
	}

	// create a new recipe
	const newRecipe = await tryPromise(
		createNewRecipe({
			title,
			ingredients,
			description,
			image,
			cookingTime,
			owner,
		})
	);

	if (newRecipe.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong creating a recipe. Please try again.",
		});
	}

	return res.status(statusCode.CREATED).send({
		message: "Recipe created successfully.",
		newRecipe: newRecipe.data,
	});
}

export async function getAllRecipes(_: express.Request, res: express.Response) {
	const recipes = await tryPromise(getRecipes());
	if (recipes.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong getting the recipes. Please try again.",
			errors: formatError(recipes.error),
		});
	}
	return res.status(statusCode.OK).send(recipes.data);
}

export async function getOwnRecipes(
	req: express.Request,
	res: express.Response
) {
	const { userId } = req.params;

	const recipes = await tryPromise(getRecipesByUser(userId));
	if (recipes.error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong getting user recipes. Please try again.",
			errors: formatError(recipes.error),
		});
	}

	return res.status(statusCode.OK).send(recipes.data);
}

export async function getSingleRecipe(
	req: express.Request,
	res: express.Response
) {
	const { id } = req.params;

	const recipe = await tryPromise(getRecipeById(id));

	if (recipe.error || !recipe.data) {
		return res
			.status(statusCode.NOT_FOUND)
			.send({ message: "Recipe not found." });
	}

	return res.status(statusCode.OK).send(recipe.data);
}

export async function deleteRecipe(
	req: express.Request,
	res: express.Response
) {
	const { recipeId } = req.params;

	// delete the recipe from the database
	const deletedRecipe = await tryPromise(deleteRecipeById(recipeId));

	if (deletedRecipe.error) {
		return res
			.status(statusCode.NOT_FOUND)
			.send({ message: "Recipe not found." });
	}

	// remove the recipe from any user's liked or fav array
	const { error } = await tryPromise(removeRecipesFromUser(recipeId));
	if (error) {
		return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong deleting a recipe. Please try again.",
		});
	}

	return res.status(statusCode.OK).send({
		message: "Recipe deleted successfully.",
	});
}

export async function updateRecipe(
	req: express.Request,
	res: express.Response
) {
	const { recipeId } = req.params;
	const { title, ingredients, description, image, cookingTime } = req.body;

	const validation = recipeSchema.safeParse({
		title,
		ingredients,
		description,
		image,
		cookingTime,
	});
	if (!validation.success) {
		const errorResult = validation as { error: ZodError };

		return res.status(statusCode.BAD_REQUEST).send({
			message: errorResult.error.issues.map((err) => err.message),
			errors: errorResult.error.issues,
		});
	}

	const updatedRecipe = await tryPromise(
		updateRecipeById(
			recipeId,
			{
				title,
				ingredients,
				description,
				image,
				cookingTime,
			},
			{ new: true, runValidators: true }
		)
	);
	if (updatedRecipe.error) {
		return res.status(statusCode.NOT_FOUND).send({
			message: "Recipe not found.",
			errors: formatError(updatedRecipe.error),
		});
	}

	updatedRecipe.data.updated = new Date();
	const { error } = await tryPromise(updatedRecipe.data.save());

	if (error) {
		return res.status(statusCode.NOT_FOUND).send({
			message: "Something went wrong updating the recipe. Please try again.",
			errors: formatError(updatedRecipe.error),
		});
	}

	return res.status(statusCode.OK).send({
		message: "Recipe updated successfully.",
		updatedRecipe: updatedRecipe.data,
	});
}
