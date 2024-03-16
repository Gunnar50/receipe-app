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

export const createRecipeSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	ingredients: z
		.array(z.string())
		.nonempty({ message: "Ingredients must contain at least 1 ingredient" }),
	description: z
		.string()
		.min(3, { message: "Description must be at least 3 characters" }),
	serves: z.number().gt(0, { message: "Serves must be at least 1 portion" }),
	cookingTime: z
		.number()
		.gt(0, { message: "Cooking time must be greater than 1 minute." }),
	image: z.string().min(1, { message: "Image must be at least 1 character." }),
});
