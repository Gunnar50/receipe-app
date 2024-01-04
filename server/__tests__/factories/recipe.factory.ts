import { createNewRecipe, RecipeType } from "../../src/models/recipe.model";
import { loginUserGetToken } from "../helper/loginUser";
import { getRandomRecipe, TRecipeData } from "../helper/recipeData";

export async function createRecipe(ownerId: string) {
	const recipePayload: TRecipeData = getRandomRecipe();
	recipePayload["owner"] = ownerId;

	return await createNewRecipe(recipePayload);
}

/** factory to:
 * create a new user
 * login the user
 * create a FEW recipes with this user
 */

export async function createRandomNumberOfRecipes() {
	// create a user
	const { user, sessionToken } = await loginUserGetToken();
	// generate a random number between 1 and 10
	const numberOfRecipes = Math.floor(Math.random() * 10) + 1;

	// create an array of promises by calling createRecipe multiple times
	const recipePromises: Promise<RecipeType>[] = [];
	for (let i = 0; i < numberOfRecipes; i++) {
		recipePromises.push(createRecipe(user._id.toString()));
	}

	const recipes: RecipeType[] = await Promise.all(recipePromises);

	return { recipes, user, sessionToken };
}
