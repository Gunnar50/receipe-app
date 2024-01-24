import {
	Anchor,
	Button,
	Container,
	Divider,
	Group,
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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import { loginSchema, signupSchema } from "../../utils/zod";

export function AuthenticationForm(props: PaperProps) {
	const { type: initialType } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [type, toggle] = useToggle(["login", "register"]);

	const form = useForm({
		initialValues: {
			username: "",
			email: "",
			password: "",
		},

		validate: zodResolver(type === "register" ? signupSchema : loginSchema),
	});

	useEffect(() => {
		toggle(initialType);
	}, [initialType]);

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

	// Use this handleError in your handleLogin and handleRegister

	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		form.validate();

		try {
			const response = await API.post("/auth/login", {
				email: form.values.email,
				password: form.values.password,
			});
			const { message, userId, username } = response.data;

			dispatch(login({ userId, username }));
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

	async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		try {
			const response = await API.post("/auth/signup", {
				username: form.values.username,
				email: form.values.email,
				password: form.values.password,
			});

			const { message, newUser } = response.data;

			// log the user in once registration is successful
			await API.post("/auth/login", {
				email: form.values.email,
				password: form.values.password,
			});

			dispatch(
				login({ userId: newUser.userId, username: form.values.username })
			);
			dispatch(setContent({ text: message, type: "success" }));
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

				<form
					onSubmit={(e) =>
						type === "register" ? handleRegister(e) : handleLogin(e)
					}
				>
					<Stack>
						{type === "register" && (
							<TextInput
								required
								placeholder="username"
								value={form.values.username}
								onChange={(event) =>
									form.setFieldValue("username", event.currentTarget.value)
								}
								radius="md"
							/>
						)}

						<TextInput
							required
							placeholder="Email"
							value={form.values.email}
							onChange={(event) =>
								form.setFieldValue("email", event.currentTarget.value)
							}
							error={form.errors.email && "Invalid email"}
							radius="md"
						/>

						<PasswordInput
							required
							placeholder="Password"
							value={form.values.password}
							onChange={(event) =>
								form.setFieldValue("password", event.currentTarget.value)
							}
							error={
								form.errors.password &&
								"Password should include at least 6 characters"
							}
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
