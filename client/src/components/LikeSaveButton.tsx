import { ActionIcon, Tooltip } from "@mantine/core";
import {
	IconBookmark,
	IconBookmarkFilled,
	IconHeart,
	IconHeartFilled,
	TablerIconsProps,
} from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import API from "../utils/api";

function LikeSaveButton({
	type,
	recipeId,
	setSelected,
	Icon,
	setIsRecipeLiked,
	setIsRecipeSaved,
}: {
	type: "Like" | "Save";
	recipeId: string;
	setSelected: boolean;
	Icon: (props: TablerIconsProps) => JSX.Element;
	setIsRecipeLiked: (value: boolean) => void;
	setIsRecipeSaved: (value: boolean) => void;
}) {
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	return (
		<Tooltip label={type} withArrow>
			<ActionIcon onClick={handleLike} variant="subtle" color="gray">
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
