import express from "express";
import {
	deleteUser,
	getUsers,
	updateUser,
} from "../controllers/users.controller";
import { isAuthenticated, isOwner } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", isAuthenticated, getUsers);
router.delete("/:id", isAuthenticated, isOwner, deleteUser);
router.put("/:id", isAuthenticated, isOwner, updateUser);

export default router;
