import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import AuthForm from "./AuthForm";

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

			const { message, newUser } = response.data;

			// log the user in once registration is successful
			await API.post("/auth/login", {
				email,
				password,
			});

			dispatch(login({ userId: newUser.userId, username }));
			dispatch(setContent({ text: message, type: "success" }));
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
			<AuthForm
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

export default Register;
