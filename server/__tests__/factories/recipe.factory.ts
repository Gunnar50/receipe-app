import { createNewRecipe } from "../../src/models/recipe.model";

export async function createRecipe(ownerId: string) {
	const recipeAttr: Record<string, any> = recipeDefinition(ownerId);
	return await createNewRecipe(recipeAttr);
}

function recipeDefinition(ownerId: string): Record<string, any> {
	return {
		title: "New Recipe Title",
		ingredients: ["i1", "i2", "i3"],
		description: "Test Taste",
		image: "images/test.png",
		cookingTime: 30,
		owner: ownerId,
	};
}
