import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import AuthForm from "./AuthForm";

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
			<AuthForm
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

export default Login;
