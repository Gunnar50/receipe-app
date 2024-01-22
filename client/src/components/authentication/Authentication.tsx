import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import Input from "./Input";

export function Auth() {
	return (
		<div className="flex justify-center mt-4">
			<Login />
			<Register />
		</div>
	);
}

function Login() {
	const [email, setEmail] = useState("test@test.com");
	const [password, setPassword] = useState("password");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		try {
			const response = await API.post("/auth/login", {
				email,
				password,
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
			if (axios.isAxiosError(error)) {
				// checks if error is from axios
				const msg = Array.isArray(error.response?.data.message)
					? error.response.data.message[0]
					: error.response?.data.message;
				const message = msg || "An error occurred";
				dispatch(setContent({ text: message, type: "error" }));
			} else {
				// handle non-axios errors
				dispatch(setContent({ text: "Login failed", type: "error" }));
			}
		}
	}

	return (
		<div className="md:w-1/2 md:max-w-md bg-white shadow p-5 md:mr-3">
			<Form
				email={email}
				password={password}
				setEmail={setEmail}
				setPassword={setPassword}
				label="Login"
				onSubmit={handleLogin}
			/>
		</div>
	);
}

function Register() {
	const [email, setEmail] = useState("test@test.com");
	const [password, setPassword] = useState("password");
	const [username, setUsername] = useState("test");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		try {
			const response = await API.post("/auth/signup", {
				email,
				password,
				username,
			});
			console.log("response", response);

			dispatch(setContent({ text: response.data.message, type: "success" }));
			navigate("/");
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				// checks if error is from axios
				const msg = Array.isArray(error.response?.data.message)
					? error.response.data.message[0]
					: error.response?.data.message;
				const message = msg || "An error occurred";
				dispatch(setContent({ text: message, type: "error" }));
			} else {
				// handle non-axios errors
				console.log("Error:", error);
				dispatch(setContent({ text: "Registration failed", type: "error" }));
			}
		}
	}

	return (
		<div className="md:w-1/2 md:max-w-md bg-white shadow p-5">
			<Form
				email={email}
				password={password}
				username={username}
				setEmail={setEmail}
				setPassword={setPassword}
				setUsername={setUsername}
				label="Sign Up"
				onSubmit={handleRegister}
			/>
		</div>
	);
}

interface FormProps {
	email: string;
	password: string;
	username?: string;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	setUsername?: (username: string) => void;
	label: string;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function Form({
	email,
	password,
	username,
	setEmail,
	setPassword,
	setUsername,
	label,
	onSubmit,
}: FormProps) {
	return (
		<form onSubmit={onSubmit}>
			<h2 className="text-xl font-semibold mb-3">{label}</h2>
			{/* EMAIL */}
			<Input placeholder="Email" value={email} setValue={setEmail} />

			{/* PASSWORD */}
			<Input placeholder="Password" value={password} setValue={setPassword} />

			{/* USERNAME */}
			{username !== undefined && setUsername !== undefined && (
				<Input placeholder="Username" value={username} setValue={setUsername} />
			)}

			{/* SUBMIT BUTTON */}
			<button
				className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all"
				type="submit"
			>
				{label}
			</button>
		</form>
	);
}
