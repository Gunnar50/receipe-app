import { constants } from "http2";

export const HTTP_STATUS = Object.fromEntries(
	Object.entries(constants)
		.filter(([key]) => key.startsWith("HTTP_STATUS_"))
		.map(([key, value]) => [key.replace("HTTP_STATUS_", ""), Number(value)])
);

/*
OK: 200,
CREATED: 201,
ACCEPTED: 202,
MOVED_PERMANENTLY: 301,
FOUND: 302,
BAD_REQUEST: 400,
UNAUTHORIZED: 401,
FORBIDDEN: 403,
NOT_FOUND: 404,
METHOD_NOT_ALLOWED: 405,
REQUEST_TIMEOUT: 408,
CONFLICT: 409,
INTERNAL_SERVER_ERROR: 500,
*/
