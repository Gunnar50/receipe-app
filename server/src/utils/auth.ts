import crypto from "crypto";

/**
 *
 * @param password
 * @throws Error
 */
export function generateHash(password: string): string | never {
	return crypto
		.createHmac("sha256", [process.env.SALT, password].join(""))
		.update(process.env.SECRET)
		.digest("hex");
}
