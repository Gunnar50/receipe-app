import crypto from "crypto";

export const generateHash = (password: string) => {
	return crypto
		.createHmac("sha256", [process.env.SALT, password].join(""))
		.update(process.env.SECRET)
		.digest("hex");
};
