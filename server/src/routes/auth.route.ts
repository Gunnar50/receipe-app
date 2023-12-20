import express from "express";
import {
	loginUser,
	logoutUser,
	signUpUser,
} from "../controllers/auth.controller";
import { isAuthenticated, isOwner } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout/:userId", isAuthenticated, isOwner, logoutUser);

export default router;
