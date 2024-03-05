import { ActionIcon, Tooltip, rem } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import { setContent } from "../redux/toastSlice";
import API from "../utils/api";
import { handleError } from "../utils/handleError";

function LikeSaveButton({
	type,
	recipeId,
	selected,
	setSelected,
	Icon,
	iconColor,
	updateRecipeLikes,
	triggerModal,
}: {
	type: "Like" | "Save";
	recipeId: string | undefined;
	selected: boolean;
	setSelected: (value: boolean) => void;
	Icon: (props: TablerIconsProps) => JSX.Element;
	iconColor?: string | undefined;
	updateRecipeLikes: (recipeId: string, newLikesCount: number) => void;
	triggerModal: (type: "login" | "register") => void;
}) {
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
			updateRecipeLikes(recipe._id, recipe.likes);

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

	useEffect(() => {
		async function getUserLikedSavedRecipes() {
			if (!isAuth) {
				return;
			}

			try {
				const response = await API.get(
					`/recipes/get-${type.toLocaleLowerCase()}/${user?.userId}`
				);
				const recipes: string[] = response.data.likedRecipes;
				if (recipeId && recipes) {
					setSelected(recipes.includes(recipeId));
				}
			} catch (err) {
				console.log(err);
			}
		}
		getUserLikedSavedRecipes();
	}, [isAuth, user, recipeId]);

	return (
		<Tooltip
			label={!selected ? type : `Un${type.toLocaleLowerCase()}`}
			withArrow
		>
			<ActionIcon onClick={handleButtons} variant="subtle" color={iconColor}>
				<Icon
					style={{ width: rem(30), height: rem(30) }}
					color={iconColor}
					stroke={1.5}
				/>
			</ActionIcon>
		</Tooltip>
	);
}

export default LikeSaveButton;
