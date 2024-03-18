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

export const recipeSchema = z.object({
	title: z
		.string({ required_error: "Title is required." })
		.min(3, { message: "Title needs to be at least 3 characters." }),
	ingredients: z
		.array(z.string())
		.nonempty({ message: "Ingredients must contain at least 1 ingredient" }),
	description: z
		.string({ required_error: "Description is required." })
		.min(3, { message: "Description needs to be at least 3 characters." }),
	image: z.string({ required_error: "Image is required." }),
	serves: z.number().gt(0, { message: "Serves must be at least 1 portion" }),
	cookingTime: z
		.number({ required_error: "Cooking time is required." })
		.int()
		.positive({ message: "Cooking time needs to be greater than zero." }),
	category: z.string().min(1, { message: "Must have a category." }),
});
