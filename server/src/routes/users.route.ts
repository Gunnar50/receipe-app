import express from "express";
import {
	deleteUser,
	getUsers,
	updateUser,
} from "../controllers/users.controller";
import { isAuthenticated, isOwner } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", isAuthenticated, getUsers);

// send the user id to be deleted
router.delete("/:id", isAuthenticated, isOwner, deleteUser);

// send the user id to be updated
router.put("/:id", isAuthenticated, isOwner, updateUser);

export default router;
