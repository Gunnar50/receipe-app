import {
	ActionIcon,
	Anchor,
	Button,
	Container,
	Divider,
	Group,
	List,
	NumberInput,
	Paper,
	PaperProps,
	PasswordInput,
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
import { createRecipeSchema } from "../utils/zod";

function CreateRecipe() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);
	const [ingredientInput, setIngredientInput] = useState("");

	const form = useForm({
		initialValues: {
			title: "",
			ingredients: [""],
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

					<Textarea
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
							required
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
						required
						label="Serves"
						placeholder="Don't enter more than 20 and less than 10"
						value={form.values.serves}
						onChange={(event) => form.setFieldValue("serves", event)}
						radius="md"
					/>
					<NumberInput
						required
						label="Cooking Time (minutes)"
						value={form.values.cookingTime}
						onChange={(event) =>
							form.setFieldValue("cookingTime", event.currentTarget.value)
						}
						error={form.errors.email && "Invalid email"}
						radius="md"
					/>
					<TextInput
						required
						label="Image URL (thumbnail)"
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
