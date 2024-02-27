import express from "express";
import {
	getLikedRecipesByUser,
	getSavedRecipesByUser,
	likeARecipe,
	saveARecipe,
} from "../controllers/likes.controller";
import {
	createRecipe,
	deleteRecipe,
	getAllRecipes,
	getOwnRecipes,
	getSingleRecipe,
	updateRecipe,
} from "../controllers/recipe.controller";
import { isAuthenticated, isOwner } from "../middlewares/auth.middleware";

const router = express.Router();

// get all the recipes
router.get("/", getAllRecipes);

// the id of the user is sent in the url to make sure that the
// user creating the recipe is the same user that is authenticated
router.post("/:userId", isAuthenticated, isOwner, createRecipe);

// get all the user's recipe by user id
router.get(
	"/get-user-recipes/:userId",
	isAuthenticated,
	isOwner,
	getOwnRecipes
);

// get a single recipe by id
router.get("/get-recipe/:id", getSingleRecipe);

// update/delete - takes user id first then recipe id
router.put("/:userId/:recipeId", isAuthenticated, isOwner, updateRecipe);
router.delete("/:userId/:recipeId", isAuthenticated, isOwner, deleteRecipe);

router.post("/like/:userId", isAuthenticated, isOwner, likeARecipe);
router.get(
	"/get-liked/:userId",
	isAuthenticated,
	isOwner,
	getLikedRecipesByUser
);
router.post("/save/:userId", isAuthenticated, isOwner, saveARecipe);
router.get(
	"/get-saved/:userId",
	isAuthenticated,
	isOwner,
	getSavedRecipesByUser
);

export default router;
