import {
	Anchor,
	Button,
	Divider,
	Group,
	Paper,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst } from "@mantine/hooks";
import axios from "axios";
import { zodResolver } from "mantine-form-zod-resolver";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import { loginSchema, signupSchema } from "../../utils/zod";

interface AuthProps {
	type: "login" | "register";
	toggleType: () => void;
	closeModal: () => void;
}

function AuthenticationForm({ closeModal, type, toggleType }: AuthProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const form = useForm({
		initialValues: {
			username: "",
			email: "test@test.com",
			password: "password",
		},

		validate: zodResolver(type === "register" ? signupSchema : loginSchema),
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
			closeModal();
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
		<Paper>
			<Divider labelPosition="center" mb="lg" />

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
						onClick={() => toggleType()}
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
	);
}

export default AuthenticationForm;
