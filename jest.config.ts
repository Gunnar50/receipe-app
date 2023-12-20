import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: [
		"<rootDir>/server/__tests__/**/*.test.ts",
		"<rootDir>/another-package/__tests__/**/*.test.ts",
	],
};

export default config;
