import request from "supertest";
import app from "../src/utils/app";
import { HTTP_STATUS as statusCode } from "../src/utils/httpStatus";
import {
	createRandomNumberOfRecipes,
	createRecipe,
} from "./factories/recipe.factory";
import { createTestUser } from "./factories/users.factory";
import { loginUserGetToken } from "./helper/loginUser";
import { getRandomRecipe } from "./helper/recipeData";
import { clearDB, closeDB, connectDB } from "./testdb";

describe("Recipes API Tests", () => {
	beforeAll(async () => {
		await connectDB();
	});
	beforeEach(async () => {
		await clearDB();
	});
	afterAll(async () => {
		await clearDB();
		await closeDB();
	});

	// get all recipes route
	describe.skip("GET /recipes/", () => {
		it("should return all recipes in the database", async () => {
			// creating a few recipes
			const { recipes } = await createRandomNumberOfRecipes();

			// test getting all recipes
			const res = await request(app).get("/recipes/");

			// get the titles of the recipes to compare
			const responseTitles = res.body.map((recipe) => recipe.title);
			const expectedTitles = recipes.map((recipe) => recipe.title);

			// check if every title in responseTitles is also present in expectedTitles
			const allTitlesMatch = responseTitles.every((title) =>
				expectedTitles.includes(title)
			);

			expect(res.statusCode).toEqual(statusCode.OK);
			expect(allTitlesMatch).toBeTruthy();
		});
	});

	// testing the post route, to create new recipes
	describe.skip("POST /recipes/:userId", () => {
		const url = "/recipes/";

		it("should not create a new recipe - missing fields", async () => {
			// generate and create a new user
			// login the user
			const { user, sessionToken } = await loginUserGetToken();

			// test creating a new recipe with missing fields
			const res = await request(app)
				.post(url + user._id)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(res.body.message).toEqual("Fields cannot be empty.");
		});

		it("should not create a new recipe - user does not exist", async () => {
			// test creating a new recipe
			const res = await request(app).post(url);
			expect(res.statusCode).toEqual(statusCode.NOT_FOUND);
		});

		it("should not create a new recipe - user is not logged in", async () => {
			// generate and create a new user
			const user = await createTestUser();

			// test creating a new recipe
			const res = await request(app).post(url + user._id);
			expect(res.statusCode).toEqual(statusCode.UNAUTHORIZED);
			expect(res.body.message).toEqual("Unathorized.");
		});

		it("should create a new recipe", async () => {
			// generate and create a new user
			// login the user
			const { user, sessionToken } = await loginUserGetToken();

			// test creating a new recipe with the user above
			const res = await request(app)
				.post(url + user._id)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`])
				.send(getRandomRecipe());

			expect(res.statusCode).toEqual(statusCode.OK);
			expect(res.body).toHaveProperty("newRecipe");
			expect(res.body.message).toEqual("Recipe created successfully.");
		});
	});

	// get a specific user's ALL recipes
	describe.skip("GET /recipes/get-user-recipes/:userId", () => {
		const url = "/recipes/get-user-recipes/";

		it("should get all the recipes of a specific user", async () => {
			// generate and create a new user
			// login the user
			// create a few recipes with user
			const { user, sessionToken, recipes } =
				await createRandomNumberOfRecipes();

			// generate a 2nd user and create a recipe
			const { user: user2 } = await loginUserGetToken("test2@example.com");
			await createRecipe(user2._id.toString());

			// test getting only the first user's recipes
			const res = await request(app)
				.get(url + user._id)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			// get the titles of the recipes to compare
			// the "user2" recipe should not be included for the test to pass
			const responseTitles = res.body.map((recipe) => recipe.title);
			const expectedTitles = recipes.map((recipe) => recipe.title);

			// check if every title in responseTitles is also present in expectedTitles
			const allTitlesMatch = responseTitles.every((title) =>
				expectedTitles.includes(title)
			);

			expect(res.statusCode).toEqual(statusCode.OK);
			expect(allTitlesMatch).toBeTruthy();
		});

		it("should not get the recipes of a specific user - using another user id", async () => {
			// generate and create a new user
			// login the user
			// create a few recipes with user
			const { sessionToken } = await createRandomNumberOfRecipes();

			// generate a 2nd user and create a recipe
			const { user: user2 } = await loginUserGetToken("test2@example.com");
			await createRecipe(user2._id.toString());

			// test getting only the first user's recipes
			const res = await request(app)
				.get(url + user2._id)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(res.statusCode).toEqual(statusCode.UNAUTHORIZED);
		});
	});

	// update a specific recipe
	// NEEDS TEST AGAIN
	describe.skip("PUT recipes/:userId/:recipeId", () => {
		it("should update a recipe", async () => {
			// generate and create a new user, login the user, create a recipe with this user
			const { recipes, user, sessionToken } =
				await createRandomNumberOfRecipes();

			// grab first recipe on the array
			const recipeId = recipes[0]._id;

			// test updating a recipe
			const res = await request(app)
				.put(`/recipes/${user._id}/${recipeId}`)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`])
				.send({ ...getRandomRecipe(), owner: user._id });

			expect(res.statusCode).toEqual(statusCode.OK);
			expect(res.body).toHaveProperty("updatedRecipe");
			expect(res.body.message).toEqual("Recipe updated successfully.");
		});
	});

	// delete a specific recipe
	// NEEDS TEST AGAIN
	describe.skip("DELETE recipes/:userId/:recipeId", () => {
		it("should delete a recipe", async () => {
			// generate and create a new user, login the user, create a recipe with this user
			const { recipes, user, sessionToken } =
				await createRandomNumberOfRecipes();

			// grab first recipe on the array
			const recipeId = recipes[0]._id;

			// test updating a recipe
			const res = await request(app)
				.delete(`/recipes/${user._id}/${recipeId}`)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(res.statusCode).toEqual(statusCode.OK);
			expect(res.body.message).toEqual("Recipe deleted successfully.");

			// verify if the recipe was deleted from the database
			const getRecipe = await request(app).get(
				`/recipes/get-recipe/${recipeId}`
			);
			expect(getRecipe.statusCode).toEqual(statusCode.NOT_FOUND);
			expect(getRecipe.body.message).toEqual("Recipe not found.");
		});

		it("should not delete a recipe - recipe does not exist", async () => {
			// generate and create a new user, login the user, create a recipe with this user
			const { user, sessionToken } = await createRandomNumberOfRecipes();

			const recipeId = "non_existent_id";

			// test updating a recipe
			const res = await request(app)
				.delete(`/recipes/${user._id}/${recipeId}`)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(res.statusCode).toEqual(statusCode.NOT_FOUND);
			expect(res.body.message).toEqual("Cannot delete, recipe not found.");
		});
	});

	// get a single recipe
	describe.skip("GET recipes/get-recipe/:id", () => {
		it("should get a single recipe of a specific user", async () => {
			// generate and create a new user
			// login the user
			// create a few recipes with user
			const { recipes } = await createRandomNumberOfRecipes();

			// grab first recipe on the array
			const recipe = recipes[0];

			// test getting only the first user's recipes
			const res = await request(app).get(`/recipes/get-recipe/${recipe._id}`);

			// get the titles of the recipes to compare
			const responseTitle = res.body.title;
			const expectedTitle = recipe.title;

			expect(res.statusCode).toEqual(statusCode.OK);
			expect(responseTitle === expectedTitle).toBeTruthy();
		});

		it("should not get a single recipe - recipe does not exist", async () => {
			const non_existent_id = "65967e794c04c1a86ea392f3";

			const res = await request(app).get(
				`/recipes/get-recipe/${non_existent_id}`
			);

			expect(res.body.message).toEqual("Recipe not found.");
			expect(res.statusCode).toEqual(statusCode.NOT_FOUND);
		});
	});
});
