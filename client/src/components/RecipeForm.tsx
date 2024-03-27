import {
	ActionIcon,
	Button,
	Group,
	NumberInput,
	Stack,
	Text,
	TextInput,
	Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import { setContent } from "../redux/toastSlice";
import API from "../utils/api";
import { handleError } from "../utils/handleError";
import { recipeSchema } from "../utils/zod";

interface RecipeValues {
	id?: string;
	title: string;
	ingredients: string[];
	description: string;
	serves: number;
	cookingTime: number;
	image: string;
	category: string;
}

interface RecipeFormProps {
	recipe?: RecipeValues;
	type: "create" | "edit";
}

function RecipeForm({ recipe, type }: RecipeFormProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);
	const [ingredientInput, setIngredientInput] = useState("");

	const form = useForm({
		initialValues: {
			title: recipe?.title || "",
			ingredients: recipe?.ingredients || [""], // add a default empty string to the array to ensure it is a array of strings
			description: recipe?.description || "",
			serves: recipe?.serves || 0,
			cookingTime: recipe?.cookingTime || 0,
			image: recipe?.image || "",
			category: recipe?.category || "",
		},

		validate: zodResolver(recipeSchema),
	});

	async function handleCreateRecipe(values: RecipeValues) {
		if (!isAuth || !user) {
			navigate("/");
			return;
		}

		form.validate();
		// removes the first default empty string from the ingredients
		form.setValues({ ingredients: [...values.ingredients.splice(0, 1)] });

		try {
			const response = await API.post(`/recipes/${user?.userId}`, values);
			const { message, newRecipe } = response.data;

			dispatch(
				setContent({
					text: message,
					type: "success",
				})
			);
			navigate(`/recipe/${newRecipe._id}`);
		} catch (error: unknown) {
			handleError(error);
		}
	}

	async function handleUpdateRecipe(values: RecipeValues) {
		if (!isAuth || !user || !recipe) {
			navigate("/");
			return;
		}

		form.validate();

		try {
			const response = await API.put(
				`/recipes/${user?.userId}/${recipe.id}`,
				values
			);
			const { message, updatedRecipe } = response.data;

			dispatch(
				setContent({
					text: message,
					type: "success",
				})
			);
			navigate(`/recipe/${updatedRecipe._id}`);
		} catch (error: unknown) {
			handleError(error);
		}
	}

	const handleIngredientAdd = () => {
		if (ingredientInput) {
			form.setValues({
				ingredients: [...form.values.ingredients, ingredientInput],
			});

			setIngredientInput("");
		}
	};

	const handleIngredientRemove = (index: number) => {
		const updatedIngredients = form.values.ingredients.filter(
			(_, i) => i !== index
		);
		form.setFieldValue("ingredients", updatedIngredients);
	};

	return (
		<form
			onSubmit={form.onSubmit((values) =>
				type === "create"
					? handleCreateRecipe(values)
					: handleUpdateRecipe(values)
			)}
		>
			<Stack>
				<TextInput
					withAsterisk
					label="Title"
					placeholder="My Amazing Recipe Title..."
					radius="md"
					{...form.getInputProps("title")}
				/>

				<Textarea
					withAsterisk
					label="Description"
					placeholder="This is where you describe your awesome recipe, and how to make it..."
					radius="md"
					{...form.getInputProps("description")}
				/>
				{form.values.ingredients.map(
					(ingredient, index) =>
						ingredient && (
							<Group key={index}>
								<Text>{ingredient}</Text>
								<ActionIcon
									color="red"
									onClick={() => handleIngredientRemove(index)}
								>
									<IconTrash size="1rem" />
								</ActionIcon>
							</Group>
						)
				)}
				<Group align="end">
					<TextInput
						value={ingredientInput}
						label="Ingredients"
						placeholder="Ingredients"
						onChange={(event) => setIngredientInput(event?.target.value)}
						radius="md"
						style={{ flex: 1 }}
					/>
					<Button onClick={handleIngredientAdd}>Add</Button>
				</Group>
				<NumberInput
					withAsterisk
					label="Serves"
					placeholder="Serves"
					radius="md"
					{...form.getInputProps("serves")}
				/>
				<NumberInput
					withAsterisk
					label="Cooking Time (minutes)"
					radius="md"
					{...form.getInputProps("cookingTime")}
				/>
				<TextInput
					withAsterisk
					label="Image URL (thumbnail)"
					placeholder="Image"
					radius="md"
					{...form.getInputProps("image")}
				/>
				<TextInput
					withAsterisk
					label="Category"
					placeholder="Category"
					radius="md"
					{...form.getInputProps("category")}
				/>
			</Stack>

			<Group mt="xl">
				<Button type="submit" radius="xl">
					{type === "create" ? "Create" : "Update"}
				</Button>
				{type === "create" ? (
					<Button radius="xl" color="red" onClick={() => form.reset()}>
						Clear
					</Button>
				) : (
					<></>
				)}
			</Group>
		</form>
	);
}

export default RecipeForm;
