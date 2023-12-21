import request from "supertest";
import app from "../src/utils/app";
import { HTTP_STATUS as statusCode } from "../src/utils/httpStatus";
import { clearDB, closeDB, connectDB } from "./testdb";

/**
 * I like these methods, but they feel more like utility functions rather than test code.
 * What you've uncovered here is the need to call your controller code from outside the normal
 * HTTP way. You should probably look to get the logic in the controllers into a helper object
 * or service (as it's called in industry) Take a look at this https://www.google.com/url?sa=i&url=https%3A%2F%2Fsoftwareengineering.stackexchange.com%2Fquestions%2F418048%2Fclean-architecture-gateway-layer-depends-on-outer-layer&psig=AOvVaw2CAIUbm-xIqvQ0d1tvExK-&ust=1703157361951000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjC58_ynYMDFQAAAAAdAAAAABAS
 *
 * Clean Architecture is an industry standard, rightly or wrongly. A lot of books and talks on the topic are
 * needlessly complicated. If in your research you get confused, let me know and I'll walk you through how it works
 */

/**
 * Ideally, this should be in the test if you want to test the endpoint.
 * Take a look at the testing pyramid https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.headspin.io%2Fblog%2Fthe-testing-pyramid-simplified-for-one-and-all&psig=AOvVaw0he2f4tyjtyf6tah0rVoRz&ust=1703157717647000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCNCb3fnznYMDFQAAAAAdAAAAABAE
 * This is an industry standard. If you mention you understand this at interview, they will like it if they are a good shop
 */

describe("Authentication & User Account Tests", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await clearDB();
		await closeDB();
	});
	/**
	 * This is a big no no. If you want data to exist in your test before it starts, you should use the beforeAll
	 * or beforeEach hooks. Or, even simpler, just have the test set the data up for you.
	 */

	/**
	 * The reason I left this here is to be able to test the update and delete routes.
	 * if I do not have the userId and token as "global variables", then I would need to create a
	 * new user and login to get the userId and token to be able to test those routes.
	 *
	 * I just thought of not repeating too much code this way.
	 * What do you think, as now we have the memory database setup too, so it is not
	 * messing up with the production db
	 */
	let userId: string = "";
	let token: string = "";

	describe("POST /auth/signup", () => {
		const url = "/auth/signup";
		const payload = {
			email: "test@example.com",
			password: "password123",
			username: "testuser",
		};

		it("should create a new user", async () => {
			// create a test user
			const res = await request(app).post(url).send(payload);
			expect(res.statusCode).toEqual(statusCode.CREATED);
			expect(res.body).toHaveProperty("newUser");
			expect(res.body.message).toEqual("User registered successfully.");

			// Aside from this line below. I really like this test. Focused and clean. Good work
			userId = res.body.newUser._id.toString();
		});

		// trying to create an account with the same email as above
		it("should not create a new user with the same email", async () => {
			const res = await request(app).post(url).send(payload);
			expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(res.body.message).toEqual(
				"Email already registered. Please login."
			);
		});

		// trying to create an account with invalid email and password
		it("should not create a new user with invalid credentials", async () => {
			const invalidPayload = {
				email: "test2example.com",
				password: "pass",
				username: "test2user",
			};
			const res = await request(app).post(url).send(invalidPayload);
			expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(res.body.message).toEqual("Validation error");
		});
	});

	describe("POST /auth/login", () => {
		const url = "/auth/login";

		// login with wrong email
		it("should not allow the login with wrong email", async () => {
			const res = await request(app)
				.post(url)
				.send({ email: "wrong_email@example.com", password: "password123" });
			expect(res.statusCode).toEqual(statusCode.FORBIDDEN);
			expect(res.body.message).toEqual("Email or Password incorrect.");
		});

		// login with wrong password
		it("should not allow the login with wrong password", async () => {
			const res = await request(app)
				.post(url)
				.send({ email: "test@example.com", password: "password" });
			expect(res.statusCode).toEqual(statusCode.FORBIDDEN);
			expect(res.body.message).toEqual("Email or Password incorrect.");
		});

		// login with invalid email or password
		it("should not allow the login with invalid credentials", async () => {
			const res = await request(app)
				.post(url)
				.send({ email: "testexample.com", password: "pass" });
			expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(res.body.message).toEqual("Validation error");
		});

		// login successfully
		it("should login the user", async () => {
			// login the test account
			const res = await request(app)
				.post(url)
				.send({ email: "test@example.com", password: "password123" });
			expect(res.statusCode).toEqual(statusCode.OK);
			expect(res.body.message).toEqual("Logged in successfully.");

			// Need to get rid of this line
			token = res.headers["set-cookie"][0];
		});
	});

	describe("PUT /users/:userId", () => {
		const updateUrl = "/users/";

		// update failed, missing password
		it("should not update, missing password", async () => {
			const updateRes = await request(app)
				.put(updateUrl + userId)
				.send({ username: "test", password: "" })
				.set("Cookie", token);
			expect(updateRes.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(updateRes.body.message).toEqual("Fields cannot be empty.");
		});

		// update failed, missing username
		it("should not update, missing username", async () => {
			const updateRes = await request(app)
				.put(updateUrl + userId)
				.send({ username: "", password: "password123" })
				.set("Cookie", token);
			expect(updateRes.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(updateRes.body.message).toEqual("Fields cannot be empty.");
		});

		// update successful
		it("should update", async () => {
			const updateRes = await request(app)
				.put(updateUrl + userId)
				.send({ username: "new-username", password: "password123" })
				.set("Cookie", token);
			expect(updateRes.statusCode).toEqual(statusCode.OK);
			expect(updateRes.body).toHaveProperty("updatedUser");
			expect(updateRes.body.message).toEqual("User updated successfully.");
		});
	});

	describe("DELETE /users/:userId", () => {
		const deleteUrl = "/users/";

		// delete user successfully
		it("should delete the user", async () => {
			// delete the user so it is not persisted in the database
			const del = await request(app)
				.delete(deleteUrl + userId)
				.set("Cookie", token);
			expect(del.statusCode).toEqual(statusCode.OK);
			expect(del.body.message).toEqual("User deleted successfully.");
		});
	});
});
