interface Input {
	placeholder: string;
	value: string;
	setValue: (value: string) => void;
}

function Input({ placeholder, value, setValue }: Input) {
	return (
		<div className="mb-4">
			<input
				className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(event) => setValue(event.target.value)}
			/>
		</div>
	);
}

export default Input;
