import {
	Anchor,
	Button,
	Container,
	Divider,
	Group,
	NumberInput,
	Paper,
	PaperProps,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import { setContent } from "../redux/toastSlice";
import API from "../utils/api";
import { handleError } from "../utils/handleError";
import { createRecipeSchema } from "../utils/zod";

interface RecipeFormValues {
	title: string;
	ingredients: string[];
	description: string;
	serves: number;
	cookingTime: number;
	image: string;
}

function CreateRecipe() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);
	const [ingredientInput, setIngredientInput] = useState("");

	const form = useForm({
		initialValues: {
			title: "",
			ingredients: [],
			description: "",
			serves: 0,
			cookingTime: 0,
			image: "",
		},

		validate: zodResolver(createRecipeSchema),
	});

	async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		form.validate();

		try {
			const response = await API.post(`/recipes/${user?.userId}`, form.values);
			const { message, newRecipe } = response.data;

			dispatch(
				setContent({
					text: message,
					type: "success",
				})
			);
			navigate("/");
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
		<Paper>
			<Divider labelPosition="center" mb="lg" />

			<form onSubmit={(e) => handleCreate(e)}>
				<Stack>
					<TextInput
						required
						label="Title"
						placeholder="My Amazing Recipe Title..."
						value={form.values.title}
						onChange={(event) =>
							form.setFieldValue("title", event.currentTarget.value)
						}
						radius="md"
					/>

					<TextInput
						required
						label="Description"
						placeholder="This is where you describe your awesome recipe, and how to make it..."
						value={form.values.description}
						onChange={(event) =>
							form.setFieldValue("description", event.currentTarget.value)
						}
						error={form.errors.email && "Invalid email"}
						radius="md"
					/>
					{form.values.ingredients.map((ingredient, index) => (
						<Group key={index}>
							<Text>{ingredient}</Text>
							<Button
								color="red"
								size="xs"
								radius="xl"
								onClick={() => handleIngredientRemove(index)}
							>
								X
							</Button>
						</Group>
					))}
					<Group>
						<TextInput
							required
							value={ingredientInput}
							placeholder="Ingredients"
							onChange={(event) => setIngredientInput(event?.target.value)}
							error={
								form.errors.password &&
								"Password should include at least 6 characters"
							}
							radius="md"
						/>
						<Button onClick={handleIngredientAdd}>Add</Button>
					</Group>
					<NumberInput
						required
						placeholder="Don't enter more than 20 and less than 10"
						value={form.values.serves}
						onChange={(event) =>
							form.setFieldValue("serves", event.currentTarget.value)
						}
						error={form.errors.email && "Invalid email"}
						radius="md"
					/>
					<NumberInput
						required
						value={form.values.cookingTime}
						onChange={(event) =>
							form.setFieldValue("cookingTime", event.currentTarget.value)
						}
						error={form.errors.email && "Invalid email"}
						radius="md"
					/>
					<TextInput
						required
						placeholder="Image"
						value={form.values.image}
						onChange={(event) =>
							form.setFieldValue("image", event.currentTarget.value)
						}
						error={form.errors.email && "Invalid email"}
						radius="md"
					/>
				</Stack>

				<Group mt="xl">
					<Button type="submit" radius="xl">
						Create
					</Button>
					<Button radius="xl" color="red" onClick={() => form.reset()}>
						Clear
					</Button>
				</Group>
			</form>
		</Paper>
	);
}
export default CreateRecipe;
