import express from "express";
import {
	loginUser,
	logoutUser,
	signUpUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
