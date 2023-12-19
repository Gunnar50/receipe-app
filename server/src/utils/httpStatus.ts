import { constants } from "http2";

export const HTTP_STATUS = Object.fromEntries(
	Object.entries(constants)
		.filter(([key]) => key.startsWith("HTTP_STATUS_"))
		.map(([key, value]) => [key.replace("HTTP_STATUS_", ""), Number(value)])
);
