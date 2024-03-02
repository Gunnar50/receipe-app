import { ActionIcon, Tooltip, rem, useMantineTheme } from "@mantine/core";
import {
	IconBookmark,
	IconBookmarkFilled,
	IconHeart,
	IconHeartFilled,
	TablerIconsProps,
} from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Recipe } from "../pages/Home";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import { setContent } from "../redux/toastSlice";
import API from "../utils/api";

function LikeSaveButton({
	type,
	recipeId,
	selected,
	setSelected,
	Icon,

	setRecipe,
	triggerModal,
}: {
	type: "Like" | "Save";
	recipeId: string;
	selected: boolean;
	setSelected: (value: boolean) => void;
	Icon: (props: TablerIconsProps) => JSX.Element;
	setRecipe: (value: Recipe | null) => void;
	triggerModal: (type: "login" | "register") => void;
}) {
	const theme = useMantineTheme();
	const isAuth = useSelector(selectIsAuthenticated);
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	async function handleButtons() {
		if (!isAuth) {
			triggerModal("login");
			return;
		}
		try {
			const response = await API.post(
				`/recipes/${type.toLocaleLowerCase()}/${user?.userId}`,
				{
					recipeId,
				}
			);
			const { message, recipe } = response.data;

			setSelected(!selected);
			setRecipe(recipe);

			dispatch(
				setContent({
					text: message,
					type: "success",
				})
			);
		} catch (error: unknown) {
			handleError(error);
		}
	}

	return (
		<Tooltip label={type} withArrow>
			<ActionIcon onClick={handleButtons} variant="subtle" color="gray">
				<Icon
					style={{ width: rem(20), height: rem(20) }}
					color={theme.colors.red[6]}
					stroke={1.5}
				/>
			</ActionIcon>
		</Tooltip>
	);
}

export default LikeSaveButton;
