import { createUser } from "../../src/models/user.model";
import { generateHash } from "../../src/utils/auth";

export async function createTestUser() {
	return await createUser({
		email: "test@example.com",
		password: generateHash("password123"),
		username: "testuser",
	});
}
