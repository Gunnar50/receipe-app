import express from "express";
import {
	favouriteARecipe,
	likeARecipe,
	unfavouriteARecipe,
	unlikeARecipe,
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

// the id of the user is send in the url to make sure that the
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
router.put("/:id/:recipeId", isAuthenticated, isOwner, updateRecipe);
router.delete("/:id/:recipeId", isAuthenticated, isOwner, deleteRecipe);

router.post("/like/:userId", isAuthenticated, isOwner, likeARecipe);
router.post("/unlike/:userId", isAuthenticated, isOwner, unlikeARecipe);
router.post("/fav/:userId", isAuthenticated, isOwner, favouriteARecipe);
router.post("/unfav/:userId", isAuthenticated, isOwner, unfavouriteARecipe);

export default router;
