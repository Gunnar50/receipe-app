import request from "supertest";
import app from "../src/utils/app";
import { HTTP_STATUS as statusCode } from "../src/utils/httpStatus";
import { createTestUser } from "./factories/users.factory";
import { loginUserGetToken } from "./helper/loginUser";
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

	beforeEach(async () => {
		await clearDB();
	});

	afterAll(async () => {
		await clearDB();
		await closeDB();
	});

	// REGISTER TEST
	describe("POST /auth/signup", () => {
		const url = "/auth/signup";

		it("should create a new user", async () => {
			const res = await request(app).post(url).send({
				email: "test@example.com",
				password: "password123",
				username: "testuser",
			});

			expect(res.statusCode).toEqual(statusCode.CREATED);
			expect(res.body).toHaveProperty("newUser");
			expect(res.body.message).toEqual("Registration successfully.");
		});

		// trying to create an account with the same email as above
		it("should not create a new user with the same email", async () => {
			// create a test user
			const existingUser = await createTestUser();

			// try to create another user with the same email as above
			const res = await request(app).post(url).send({
				email: existingUser.email,
				password: "password123",
				username: "anotherUser",
			});

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
			expect(res.body.message).toEqual([
				"Invalid email format.",
				"Password must be a minimum of 6 characters.",
			]);
		});
	});

	// LOGIN TEST
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

		// login with invalid email and password
		it("should not allow the login with invalid credentials", async () => {
			const res = await request(app)
				.post(url)
				.send({ email: "testexample.com", password: "pass" });

			expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(res.body.message).toEqual([
				"Invalid email format.",
				"Password must be a minimum of 6 characters.",
			]);
		});

		// login twice with correct credentials
		it("should login the user the first time, and reject the second time", async () => {
			const { loginResponse } = await loginUserGetToken();
			expect(loginResponse.statusCode).toEqual(statusCode.OK);
			expect(loginResponse.body.message).toEqual("Logged in successfully.");

			// tries to login a second time with the same credentials, it should work fine as it is just updating the session
			const { loginResponse: loginResponse2 } = await loginUserGetToken();
			expect(loginResponse2.statusCode).toEqual(statusCode.OK);
			expect(loginResponse2.body.message).toEqual("Logged in successfully.");
		});

		// login successfully
		it("should login the user", async () => {
			const { loginResponse, user } = await loginUserGetToken();

			expect(loginResponse.statusCode).toEqual(statusCode.OK);
			expect(loginResponse.body.userId).toEqual(user._id.toString());
			expect(loginResponse.body.message).toEqual("Logged in successfully.");
		});
	});

	// LOGOUT TEST
	describe("POST /auth/logout/:userId", () => {
		const url = "/auth/logout/";

		// logout if not logged in
		it("should return 404 if user is not logged in asit does not pass a user id", async () => {
			const res = await request(app).post(url);

			expect(res.statusCode).toEqual(statusCode.NOT_FOUND);
		});

		// should allow loggin out
		it("should allow user to logout", async () => {
			const { user, sessionToken } = await loginUserGetToken();

			const res = await request(app)
				.post(url + user._id)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(res.statusCode).toEqual(statusCode.OK);
			expect(res.body.message).toEqual("Logged out successfully.");
		});
	});

	// UPDATE TESTS
	describe("PUT /users/:userId", () => {
		const updateUrl = "/users/";

		// update failed, missing password
		it("should not update, missing password", async () => {
			const { user, sessionToken } = await loginUserGetToken();

			const updateRes = await request(app)
				.put(updateUrl + user._id)
				.send({ username: "test", password: "" })
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(updateRes.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(updateRes.body.message).toEqual("Fields cannot be empty.");
		});

		// update failed, missing username
		it("should not update, missing username", async () => {
			const { user, sessionToken } = await loginUserGetToken();

			const updateRes = await request(app)
				.put(updateUrl + user._id)
				.send({ username: "", password: "password123" })
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(updateRes.statusCode).toEqual(statusCode.BAD_REQUEST);
			expect(updateRes.body.message).toEqual("Fields cannot be empty.");
		});

		// update successful
		it("should update", async () => {
			const { user, sessionToken } = await loginUserGetToken();

			const updateRes = await request(app)
				.put(updateUrl + user._id)
				.send({ username: "new-username", password: "password123" })
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(updateRes.statusCode).toEqual(statusCode.OK);
			expect(updateRes.body).toHaveProperty("updatedUser");
			expect(updateRes.body.message).toEqual("User updated successfully.");
		});
	});

	describe("DELETE /users/:userId", () => {
		const deleteUrl = "/users/";

		// delete user successfully
		it("should delete the user", async () => {
			const { user, sessionToken } = await loginUserGetToken();

			const del = await request(app)
				.delete(deleteUrl + user._id)
				.set("Cookie", [`sessionToken=${sessionToken.data?._id}`]);

			expect(del.statusCode).toEqual(statusCode.OK);
			expect(del.body.message).toEqual("User deleted successfully.");
		});
	});
});
