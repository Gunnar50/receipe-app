import request from "supertest";
import { app, mongodb, server } from "../src/index";
import { HTTP_STATUS as statusCode } from "../src/utils/httpStatus";

/**
 * I like these methods, but they feel more like utility functions rather than test code.
 * What you've uncovered here is the need to call your controller code from outside the normal
 * HTTP way. You should probably look to get the logic in the controllers into a helper object
 * or service (as it's called in industry) Take a look at this https://www.google.com/url?sa=i&url=https%3A%2F%2Fsoftwareengineering.stackexchange.com%2Fquestions%2F418048%2Fclean-architecture-gateway-layer-depends-on-outer-layer&psig=AOvVaw2CAIUbm-xIqvQ0d1tvExK-&ust=1703157361951000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjC58_ynYMDFQAAAAAdAAAAABAS
 *
 * Clean Architecture is an industry standard, rightly or wrongly. A lot of books and talks on the topic are
 * needlessly complicated. If in your research you get confused, let me know and I'll walk you through how it works
 */
async function createUser(
	email: string = "test@example.com",
	password: string = "password123",
	username: string = "testuser"
) {
	/**
	 * Ideally, this should be in the test if you want to test the endpoint.
	 * Take a look at the testing pyramid https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.headspin.io%2Fblog%2Fthe-testing-pyramid-simplified-for-one-and-all&psig=AOvVaw0he2f4tyjtyf6tah0rVoRz&ust=1703157717647000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCNCb3fnznYMDFQAAAAAdAAAAABAE
	 * This is an industry standard. If you mention you understand this at interview, they will like it if they are a good shop
	 */
	return await request(app).post("/auth/signup").send({
		email,
		password,
		username,
	});
}

async function loginUser(
	email: string = "test@example.com",
	password: string = "password123"
) {
	return await request(app).post("/auth/login").send({
		email,
		password,
	});
}

async function deleteUser(id: string, token: string) {
	return await request(app).delete(`/users/${id}`).set("Cookie", token);
}

async function updateUser(
	id: string,
	password: { username: string; password: string },
	token: string
) {
	return await request(app)
		.put(`/users/${id}`)
		.send(password)
		.set("Cookie", token);
}

describe("Authentication & User Account Tests", () => {
	/**
	 * This is a big no no. If you want data to exist in your test before it starts, you should use the beforeAll
	 * or beforeEach hooks. Or, even simpler, just have the test set the data up for you.
	 */
	let userId: string = "";
	let token: string = "";

	// create and delete an user
	it("should create a new user", async () => {
		// create a test user
		const res = await createUser();
		expect(res.statusCode).toEqual(statusCode.CREATED);
		expect(res.body).toHaveProperty("newUser");
		expect(res.body.message).toEqual("User registered successfully.");

		// Aside from this line below. I really like this test. Focused and clean. Good work
		userId = res.body.newUser._id.toString();
	});

	// trying to create an account with the same email as above
	it("should not create a new user with the same email", async () => {
		// try creating account with the same email
		const res = await createUser();
		expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
		expect(res.body.message).toEqual("Email already registered. Please login.");
	});

	// trying to create an user with invalid email and password
	it("should not create a new user with invalid credentials", async () => {
		const res = await createUser("test2example.com", "pass", "test2user");
		expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
		expect(res.body.message).toEqual("Validation error");
	});

	// login with wrong email
	it("should not allow the login with wrong email", async () => {
		const res = await loginUser("wrongemail@example.com", "password123");
		expect(res.statusCode).toEqual(statusCode.FORBIDDEN);
		expect(res.body.message).toEqual("Email or Password incorrect.");
	});

	// login with wrong password
	it("should not allow the login with wrong password", async () => {
		const res = await loginUser("test@example.com", "password");
		expect(res.statusCode).toEqual(statusCode.FORBIDDEN);
		expect(res.body.message).toEqual("Email or Password incorrect.");
	});

	// login with invalid email or password
	it("should not allow the login with invalid credentials", async () => {
		const res = await loginUser("test2example.com", "pass");
		expect(res.statusCode).toEqual(statusCode.BAD_REQUEST);
		expect(res.body.message).toEqual("Validation error");
	});

	// login successfully
	it("should login the user", async () => {
		// login the test account
		const loginRes = await loginUser();
		expect(loginRes.statusCode).toEqual(statusCode.OK);
		expect(loginRes.body.message).toEqual("Logged in successfully.");

		// Need to get rid of this line
		token = loginRes.headers["set-cookie"][0];
	});

	// update failed, missing password
	it("should not update, missing password", async () => {
		const updateRes = await updateUser(
			userId,
			{ username: "test", password: "" },
			token
		);
		expect(updateRes.statusCode).toEqual(statusCode.BAD_REQUEST);
		expect(updateRes.body.message).toEqual("Fields cannot be empty.");
	});

	// update failed, missing username
	it("should not update, missing username", async () => {
		const updateRes = await updateUser(
			userId,
			{ username: "", password: "password123" },
			token
		);
		expect(updateRes.statusCode).toEqual(statusCode.BAD_REQUEST);
		expect(updateRes.body.message).toEqual("Fields cannot be empty.");
	});

	// update successful
	it("should update", async () => {
		const updateRes = await updateUser(
			userId,
			{ username: "new-username", password: "password123" },
			token
		);
		expect(updateRes.statusCode).toEqual(statusCode.OK);
		expect(updateRes.body).toHaveProperty("updatedUser");
		expect(updateRes.body.message).toEqual("User updated successfully.");
	});

	// delete user successfully
	it("should delete the user", async () => {
		// delete the user so it is not persisted in the database
		const del = await deleteUser(userId, token);
		expect(del.statusCode).toEqual(statusCode.OK);
		expect(del.body.message).toEqual("User deleted successfully.");
	});
});

afterAll(async () => {
	/**
	 * At the moment, you're writing test data to your normal database. This is a big no no
	 * By doing this, we'll clear out any data added to the test. However, as we are using our
	 * "Production" database, we may not want this. Ideally, you should set up a test version
	 * of your database in Mongo so that you can run your tests and clean data as needed
	 *
	 */
	await mongodb.dropDatabase();
	await mongodb.close();
	server.close();
});
