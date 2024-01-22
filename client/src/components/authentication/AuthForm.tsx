import React from "react";
import Input from "../Input";

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

function AuthForm({
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

export default AuthForm;
