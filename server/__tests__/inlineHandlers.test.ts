import { formatError, tryPromise, trySync } from "../src/utils/inlineHandlers";

describe("Testing the inlineHandlers", () => {
	describe("tryPromise", () => {
		it("should return data on successful promise resolution", async () => {
			const successPromise = Promise.resolve("Success");
			const result = await tryPromise(successPromise);
			expect(result).toEqual({ data: "Success", error: null });
		});

		it("should return error on promise rejection", async () => {
			const error = new Error("Failure");
			const failurePromise = Promise.reject(error);
			const result = await tryPromise(failurePromise);
			expect(result).toEqual({ data: null, error });
		});
	});

	describe("trySync", () => {
		it("should return data on successful function execution", () => {
			const result = trySync(() => "Success");
			expect(result).toEqual({ data: "Success", error: null });
		});

		it("should return error on function exception", () => {
			const error = new Error("Failure");
			const result = trySync(() => {
				throw error;
			});
			expect(result).toEqual({ data: null, error });
		});
	});

	describe("formatError", () => {
		it("should format the error correctly", () => {
			const error = new Error("Test error");
			const formattedError = formatError(error);
			expect(formattedError).toEqual({ error: "Error", message: "Test error" });
		});
	});
});
