import {
	IconBookmark,
	IconBookmarkFilled,
	IconHeart,
	IconHeartFilled,
} from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import API from "../utils/api";

function LikeSaveButton({
	type,
	recipeId,
	icon,
	setSelected,
}: {
	type: "like" | "save";
	recipeId: string;
	icon: JSX.Element;
	setSelected: boolean;
}) {
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	return <div>LikeSaveButton</div>;
}

export default LikeSaveButton;
