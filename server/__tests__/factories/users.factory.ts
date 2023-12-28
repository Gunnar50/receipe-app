import { createUser } from "../../src/models/user.model";
import { generateHash } from "../../src/utils/auth";

export async function createTestUser() {
	const userAttrs: Record<string, any> = userDefinition();

	return await createUser(userAttrs);
}

/**
 * This is the basic user definition that will always be used when creating
 * a user. If you want random data, you could add faker, or use Uuid and access X
 * number of characters.
 */
function userDefinition(): Record<string, any> {
	return {
		email: "test@example.com",
		password: generateHash("password123"),
		username: "testuser",
	};
}
