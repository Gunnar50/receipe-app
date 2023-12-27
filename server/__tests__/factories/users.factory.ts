import { createUser } from "../../src/models/user.model";
import { generateHash } from "../../src/utils/auth";

interface factoryOptions {
	traits: Array<string>;
	attributes: Record<string, any>;
}

export async function createTestUser(
	opts: factoryOptions = { traits: [], attributes: {} }
) {
	const attrsToAttach: Record<string, any> = userDefinition();

	/**
	 * If you decide you don't want traits, you can remove this
	 */
	if (opts.traits.length > 0) {
		opts.traits.forEach((trait) => attachTrait(trait, attrsToAttach));
	}

	const userAttrs = Object.assign(attrsToAttach, opts.attributes);

	return await createUser(userAttrs);
}

/**
 * This is the basic user definition that will always be used when creating
 * a user. If you want random data, you could add faker, or use Uuid and access X
 * number of characters.
 */
function userDefinition(): Record<string, any> {
	const data: Record<string, any> = {
		email: "test@example.com",
		password: generateHash("password123"),
		username: "testuser",
	};

	return data;
}

/**
 * Traits are for if you want to create templates of data you want on users.
 * There are much nicer ways of doing this, but if you're just experimenting,
 * this will work for a while.
 */
function attachTrait(trait: string, attributes: Record<string, any>) {
	switch (trait) {
		case "admin":
			attributes["email"] = "admin_user@admin_user.com";
			break;
		default:
	}
}
