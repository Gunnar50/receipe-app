import { createUser } from "../../src/models/user.model";
import { generateHash } from "../../src/utils/auth";

export async function createTestUser(email: string = "test@example.com") {
	return await createUser({
		email,
		password: generateHash("password123"),
		username: "testuser",
	});
}
