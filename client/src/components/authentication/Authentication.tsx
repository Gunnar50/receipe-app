import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";

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
	const [password, setPassword] = useState("password123");
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
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
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

			dispatch(setContent({ text: "Register Successfully", type: "success" }));
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
			<div className="mb-4">
				<input
					className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					type="text"
					placeholder="Email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
				/>
			</div>
			{/* PASSWORD */}
			<div className="mb-4">
				<input
					className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				/>
			</div>
			{username !== undefined && setUsername !== undefined && (
				<div className="mb-4">
					<input
						className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						type="text"
						placeholder="Username"
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
				</div>
			)}
			<button
				className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all"
				type="submit"
			>
				{label}
			</button>
		</form>
	);
}
