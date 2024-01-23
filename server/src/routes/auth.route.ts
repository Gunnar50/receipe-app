import express from "express";
import {
	loginUser,
	logoutUser,
	signUpUser,
	validateSession,
} from "../controllers/auth.controller";
import { isAuthenticated, isOwner } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get(
	"/validate-session/:userId",
	isAuthenticated,
	isOwner,
	validateSession
);
router.get("/logout/:userId", isAuthenticated, isOwner, logoutUser);

export default router;
