import {
	Box,
	Button,
	Divider,
	Grid,
	Group,
	Image,
	List,
	Stack,
	Text,
	Title,
	rem,
	useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
	IconBookmark,
	IconBookmarkFilled,
	IconHeart,
	IconHeartFilled,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import { setContent } from "../redux/toastSlice";
import API from "../utils/api";
import { Recipe } from "./Home";
import classes from "./RecipeDetails.module.css";

interface RecipeProps {
	triggerModal: (type: "login" | "register") => void;
}

function RecipeDetail({ triggerModal }: RecipeProps) {
	const theme = useMantineTheme();
	const dispatch = useDispatch();

	const { recipeId } = useParams();
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isRecipeLiked, setIsRecipeLiked] = useState<boolean>(false);
	const [isRecipeSaved, setIsRecipeSaved] = useState<boolean>(false);

	const HeartIcon = isRecipeLiked ? IconHeartFilled : IconHeart;
	const BookmarkIcon = isRecipeSaved ? IconBookmarkFilled : IconBookmark;

	const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

	function handleError(error: unknown) {
		if (axios.isAxiosError(error)) {
			const msg = Array.isArray(error.response?.data.message)
				? error.response.data.message[0]
				: error.response?.data.message;
			dispatch(setContent({ text: msg || "An error occurred", type: "error" }));
		} else {
			console.log("Error:", error);
			dispatch(setContent({ text: "Operation failed", type: "error" }));
		}
	}

	useEffect(() => {
		async function getRecipe() {
			try {
				const response = await API.get(`/recipes/get-recipe/${recipeId}`);
				setRecipe(response.data);
			} catch (err) {
				console.log(err);
			}
		}

		getRecipe();
	}, [recipeId]);

	useEffect(() => {
		async function getUserLikedSavedRecipes(type: "liked" | "saved") {
			if (!isAuth) {
				return;
			}

			try {
				const response = await API.get(`/recipes/get-${type}/${user?.userId}`);
				const recipes: string[] = response.data.likedRecipes;
				if (recipeId) {
					if (type === "liked") setIsRecipeLiked(recipes.includes(recipeId));
					else setIsRecipeSaved(recipes.includes(recipeId));
				}
			} catch (err) {
				console.log(err);
			}
		}
		getUserLikedSavedRecipes("liked");
		getUserLikedSavedRecipes("saved");
	}, [isAuth, user, recipeId]);

	async function handleButtons(type: "like" | "save") {
		if (!isAuth) {
			triggerModal("login");
			return;
		}
		try {
			const response = await API.post(`/recipes/${type}/${user?.userId}`, {
				recipeId,
			});
			const { message, recipe } = response.data;

			if (type === "like") setIsRecipeLiked(!isRecipeLiked);
			else setIsRecipeSaved(!isRecipeSaved);
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

	if (!recipe) return "Loading...";
	return (
		<>
			<Grid gutter={"lg"} className={classes.detailGrid}>
				<Grid.Col span={{ sm: 5 }}>
					<Image
						src={recipe.image}
						alt={recipe.title}
						style={{ width: "100%", height: "auto", borderRadius: "7px" }}
					/>
				</Grid.Col>
				<Grid.Col span={{ sm: 7 }}>
					<Stack justify="space-between" style={{ height: "100%" }}>
						<Stack gap="0.5rem">
							<Group wrap="nowrap" align="flex-start" justify="space-between">
								<Title order={2}>{recipe.title}</Title>
								<Group wrap="nowrap">
									<Button
										style={isDesktop ? { minWidth: "5rem" } : {}}
										variant="light"
										color="red"
										radius="md"
										size="xs"
										onClick={() => handleButtons("like")}
									>
										<HeartIcon
											style={{
												width: rem(20),
												height: rem(20),
												marginRight: rem(5),
											}}
											stroke={1.5}
										/>{" "}
										{isDesktop ? (isRecipeLiked ? "Unlike" : "Like") : ""}
									</Button>
									<Button
										style={isDesktop ? { minWidth: "5rem" } : {}}
										variant="light"
										color="blue"
										size="xs"
										radius="md"
										onClick={() => handleButtons("save")}
									>
										<BookmarkIcon
											style={{
												width: rem(20),
												height: rem(20),
												marginRight: rem(5),
											}}
											stroke={1.5}
										/>{" "}
										{isDesktop ? (isRecipeSaved ? "Unsave" : "Save") : ""}
									</Button>
								</Group>
							</Group>

							<Text size="sm" c="dimmed" style={{ marginBottom: "md" }}>
								by{" "}
								<span style={{ fontWeight: 500 }}>
									{recipe.owner?.username ? recipe.owner.username : "Unknown"}
								</span>
							</Text>

							<Text size="sm" fz="xs" c="dimmed" style={{ marginBottom: "md" }}>
								{recipe.likes} people liked this recipe
							</Text>
						</Stack>

						<Grid justify="space-around">
							<Grid.Col
								span={4}
								style={{ textAlign: "center", borderRight: "solid 1px gray" }}
							>
								<Text style={{ fontSize: 48 }}>
									{recipe.ingredients.length}
								</Text>
								<Text>ingredients</Text>
							</Grid.Col>
							<Grid.Col
								span={4}
								style={{ textAlign: "center", borderRight: "solid 1px gray" }}
							>
								<Text style={{ fontSize: 48 }}>{recipe.cookingTime}</Text>
								<Text>minutes</Text>
							</Grid.Col>
							<Grid.Col span={4} style={{ textAlign: "center" }}>
								<Text style={{ fontSize: 48 }}>{recipe.serves}</Text>
								<Text>servings</Text>
							</Grid.Col>
						</Grid>
					</Stack>
				</Grid.Col>
			</Grid>

			<Divider my="4rem" />

			<Grid gutter={"lg"} className={classes.detailGrid}>
				<Grid.Col span={{ sm: 5 }}>
					<Box>
						<Title order={3}>Ingredients</Title>
						<List withPadding>
							{recipe.ingredients.map((item, idx) => (
								<List.Item key={idx}>{item}</List.Item>
							))}
						</List>
					</Box>
				</Grid.Col>
				<Grid.Col span={{ sm: 7 }}>
					<Box>
						<Title order={3}>Description</Title>
						<Text>{recipe.description}</Text>
					</Box>
				</Grid.Col>
			</Grid>
		</>
	);
}

export default RecipeDetail;
