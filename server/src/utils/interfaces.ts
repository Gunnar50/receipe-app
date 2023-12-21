import express from "express";

export interface UpdateOptions {
	new?: boolean;
	runValidators?: boolean;
}

export interface AuthenticatedRequest extends express.Request {
	userId: string;
}
