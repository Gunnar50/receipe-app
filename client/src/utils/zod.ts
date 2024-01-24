import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email format." }),
	password: z.string().min(6, {
		message: "Password must be a minimum of 6 characters.",
	}),
});

export const signupSchema = loginSchema.extend({
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters" }),
});
