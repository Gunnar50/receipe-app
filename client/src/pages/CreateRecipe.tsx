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
import { upperFirst, useToggle } from "@mantine/hooks";
import axios from "axios";
import { zodResolver } from "mantine-form-zod-resolver";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import { setContent } from "../redux/toastSlice";
import API from "../utils/api";
import { loginSchema, signupSchema } from "../utils/zod";

function CreateRecipe(props: PaperProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [type, toggle] = useToggle(["login", "register"]);
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	const form = useForm({
		initialValues: {
			title: "",
			ingredients: [],
			description: "",
			serves: 0,
			cookingTime: 0,
			image: "",
		},

		validate: zodResolver(loginSchema),
	});

	function handleError(error: unknown) {
		if (axios.isAxiosError(error)) {
			const msg = Array.isArray(error.response?.data.message)
				? error.response.data.message[0]
				: error.response?.data.message;
			dispatch(setContent({ text: msg || "An error occurred", type: "error" }));
		} else {
			console.log("Error:", error);
			dispatch(setContent({ text: "Operation failed", type: "error" }));
		}
	}

	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		form.validate();

		try {
			const response = await API.post(`/recipes/${user?.userId}`, {
				title: form.values.title,
				ingredients: form.values.ingredients,
				descripiton: form.values.description,
				serves: form.values.serves,
				cookingTime: form.values.cookingTime,
				image: form.values.image,
			});
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

	return (
		<Container size={450} my={40}>
			<Paper radius="md" shadow="md" p="xl" withBorder {...props}>
				<Text size="lg" fw={500}>
					Welcome to RecipesApp, please {type}!
				</Text>

				<Divider labelPosition="center" my="lg" />

				<form onSubmit={(e) => handleLogin(e)}>
					<Stack>
						<TextInput
							required
							placeholder="Title"
							value={form.values.title}
							onChange={(event) =>
								form.setFieldValue("title", event.currentTarget.value)
							}
							radius="md"
						/>

						<TextInput
							required
							placeholder="Description"
							value={form.values.description}
							onChange={(event) =>
								form.setFieldValue("description", event.currentTarget.value)
							}
							error={form.errors.email && "Invalid email"}
							radius="md"
						/>

						<TextInput
							required
							placeholder="Ingredients"
							value={form.values.ingredients}
							onChange={(event) =>
								form.setFieldValue("ingredients", event.currentTarget.value)
							}
							error={
								form.errors.password &&
								"Password should include at least 6 characters"
							}
							radius="md"
						/>
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

					<Group justify="space-between" mt="xl">
						<Anchor
							component="button"
							type="button"
							c="dimmed"
							onClick={() => toggle()}
							size="xs"
						>
							{type === "register"
								? "Already have an account? Login"
								: "Don't have an account? Register"}
						</Anchor>
						<Button type="submit" radius="xl">
							{upperFirst(type)}
						</Button>
					</Group>
				</form>
			</Paper>
		</Container>
	);
}
export default CreateRecipe;
