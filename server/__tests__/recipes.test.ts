import request from "supertest";
import app from "../src/utils/app";
import { HTTP_STATUS as statusCode } from "../src/utils/httpStatus";
import { createRecipe } from "./factories/recipe.factory";
import { clearDB, closeDB, connectDB } from "./testdb";

describe.skip("Recipes API Tests", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await clearDB();
		await closeDB();
	});

	// testing the post route, to create new recipes
	describe("POST /recipes/:userId", () => {
		it("should create a new recipe", () => {
			// generate and create a new user
			// login the user
			// test creating a new recipe
		});

		it("should not create a new recipe - missing fields", () => {
			// generate and create a new user
			// login the user
			// test creating a new recipe with missing fields
		});

		it("should not create a new recipe - user not logged in", () => {
			// generate and create a new user
			// test creating a new recipe
		});
	});

	// get all recipes route
	describe("GET /", () => {});

	// get a specific user's recipes
	describe("GET /get-user-recipes/:userId", () => {});

	// get a single recipe
	describe("GET /get-recipe/:id", () => {});

	// update a specific recipe
	describe("PUT /:userId/:recipeId", () => {});

	// delete a specific recipe
	describe("DELETE /:userId/:recipeId", () => {});
});
