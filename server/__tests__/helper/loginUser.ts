import request from "supertest";
import { getSessionByUserId } from "../../src/models/session.model";
import app from "../../src/utils/app";
import { tryPromise } from "../../src/utils/inlineHandlers";
import { createTestUser } from "../factories/users.factory";

export async function loginUserGetToken(email: string = "test@example.com") {
	// create a user
	const user = await createTestUser(email);

	// login the test user
	const loginResponse = await request(app).post("/auth/login").send({
		email: user.email,
		password: "password123",
	});

	// get the session token with that user id
	const sessionToken = await tryPromise(
		getSessionByUserId(user._id as unknown as string)
	);

	// return the user and session token
	return { user, loginResponse, sessionToken };
}
