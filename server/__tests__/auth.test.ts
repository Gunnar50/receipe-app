import request from "supertest";
import { app, mongodb, server } from "../src/index";
import { HTTP_STATUS as statusCode } from "../src/utils/httpStatus";

async function createUser(
	email: string = "test@example.com",
	password: string = "password123",
	username: string = "testuser"
) {
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
	let userId: string = "";
	let token: string = "";

	// create and delete an user
	it("should create a new user", async () => {
		// create a test user
		const res = await createUser();
		expect(res.statusCode).toEqual(statusCode.CREATED);
		expect(res.body).toHaveProperty("newUser");
		expect(res.body.message).toEqual("User registered successfully.");

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
	await mongodb.close();
	server.close();
});
