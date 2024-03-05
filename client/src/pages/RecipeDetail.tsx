import {
	Box,
	Divider,
	Grid,
	Group,
	Image,
	List,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import {
	IconBookmark,
	IconBookmarkFilled,
	IconHeart,
	IconHeartFilled,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LikeSaveButton from "../components/LikeSaveButton";
import API from "../utils/api";
import { Recipe } from "./Home";
import classes from "./RecipeDetails.module.css";

interface RecipeProps {
	triggerModal: (type: "login" | "register") => void;
}

function RecipeDetail({ triggerModal }: RecipeProps) {
	const { recipeId } = useParams();

	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isRecipeLiked, setIsRecipeLiked] = useState<boolean>(false);
	const [isRecipeSaved, setIsRecipeSaved] = useState<boolean>(false);

	const HeartIcon = isRecipeLiked ? IconHeartFilled : IconHeart;
	const BookmarkIcon = isRecipeSaved ? IconBookmarkFilled : IconBookmark;

	function updateRecipeLikes(recipeId: string, newLikesCount: number) {
		if (recipe && recipe._id === recipeId) {
			setRecipe({ ...recipe, likes: newLikesCount });
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
									<LikeSaveButton
										type="Like"
										recipeId={recipeId}
										selected={isRecipeLiked}
										setSelected={setIsRecipeLiked}
										Icon={HeartIcon}
										iconColor="red"
										updateRecipeLikes={updateRecipeLikes}
										triggerModal={triggerModal}
									/>

									<LikeSaveButton
										type="Save"
										recipeId={recipeId}
										selected={isRecipeSaved}
										setSelected={setIsRecipeSaved}
										Icon={BookmarkIcon}
										updateRecipeLikes={updateRecipeLikes}
										triggerModal={triggerModal}
									/>
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
