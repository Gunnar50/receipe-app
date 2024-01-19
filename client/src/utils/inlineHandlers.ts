export interface Try<T> {
	data: T | null;
	error: Error | null;
}

export interface StandardError {
	error: string;
	message: string;
}

// provides a standard way of dealing with success and error catching
export async function tryPromise<T>(func: Promise<T>): Promise<Try<T>> {
	try {
		const data = await func;

		return <Try<T>>{ data, error: null };
	} catch (error) {
		const result = <Try<T>>{ data: null, error };
		// console.error(result.error?.message);

		return result;
	}
}

export function trySync<T>(func: Function): Try<T> {
	try {
		return <Try<T>>{ data: func(), error: null };
	} catch (error) {
		const result = <Try<T>>{ data: null, error };
		// console.error(result.error?.message);

		return result;
	}
}

export function formatError(err: Error): StandardError {
	return {
		error: err.name,
		message: err.message,
	};
}
