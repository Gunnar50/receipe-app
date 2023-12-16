import crypto from "crypto";

// Could be an export default really. Not fussed, but arror function stuff still applies
/**
 * 
 * @param password 
 * @throws Error
 */
export function generateHash(password: string): string | never {
	return crypto
		.createHmac("sha256", [process.env.SALT, password].join(""))
		.update(process.env.SECRET) // what id I haven't set the SECRET envvar? readme doesn't mention this
		.digest("hex");
};
