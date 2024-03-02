import axios from "axios";

export function handleError(error: unknown) {
	if (axios.isAxiosError(error)) {
		const msg = Array.isArray(error.response?.data.message)
			? error.response.data.message[0]
			: error.response?.data.message;
		console.log(msg);
		// dispatch(setContent({ text: msg || "An error occurred", type: "error" }));
	} else {
		console.log("Error:", error);
		// dispatch(setContent({ text: "Operation failed", type: "error" }));
	}
}
