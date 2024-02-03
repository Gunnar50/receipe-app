import {
	Badge,
	Box,
	Button,
	Card,
	Grid,
	Group,
	Image,
	List,
	Stack,
	Text,
	Title,
	rem,
} from "@mantine/core";
import { IconBookmark, IconHeart } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { Recipe } from "./Home";

function RecipeDetail() {
	const { recipeId } = useParams();
	const [recipe, setRecipe] = useState<Recipe | null>(null);

	useEffect(() => {
		const getRecipe = async () => {
			try {
				const response = await API.get(`/recipes/get-recipe/${recipeId}`);

				setRecipe(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		getRecipe();
	}, [recipeId]);

	if (!recipe) return "Loading...";
	return (
		<Grid gutter={"xl"}>
			<Grid.Col span={{ xs: 5 }}>
				<Image
					src={recipe.image}
					alt={recipe.title}
					style={{ width: "100%", height: "auto", borderRadius: "7px" }}
				/>
			</Grid.Col>
			<Grid.Col span={{ xs: 7 }}>
				<Stack justify="space-between" style={{ height: "100%" }}>
					<Stack gap="0.5rem">
						<Group wrap="nowrap" align="flex-start" justify="space-between">
							<Title order={2}>{recipe.title}</Title>
							<Group wrap="nowrap">
								<Button
									style={{ minWidth: "5rem" }}
									variant="light"
									color="red"
									radius="md"
									size="xs"
								>
									<IconHeart
										style={{
											width: rem(20),
											height: rem(20),
											marginRight: rem(5),
										}}
										stroke={1.5}
									/>{" "}
									Like
								</Button>
								<Button
									style={{ minWidth: "5rem" }}
									variant="light"
									color="blue"
									size="xs"
									radius="md"
								>
									<IconBookmark
										style={{
											width: rem(20),
											height: rem(20),
											marginRight: rem(5),
										}}
										stroke={1.5}
									/>{" "}
									Save
								</Button>
							</Group>
						</Group>

						<Text size="sm" style={{ marginBottom: "md" }}>
							by{" "}
							<span style={{ fontWeight: 500 }}>
								{recipe.owner?.username ? recipe.owner.username : "Unknown"}
							</span>
						</Text>
					</Stack>

					<Grid justify="space-around">
						<Grid.Col
							span={4}
							style={{ textAlign: "center", borderRight: "solid 1px gray" }}
						>
							<Text style={{ fontSize: 48 }}>{recipe.ingredients.length}</Text>
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
			<Grid.Col span={{ xs: 5 }}>
				<Box>
					<Title order={3}>Ingredients</Title>
					<List withPadding>
						{recipe.ingredients.map((item, idx) => (
							<List.Item key={idx}>{item}</List.Item>
						))}
					</List>
				</Box>
			</Grid.Col>
			<Grid.Col span={{ xs: 7 }}>
				<Box>
					<Title order={3}>Description</Title>
					<Text>{recipe.description}</Text>
				</Box>
			</Grid.Col>
		</Grid>
	);
}

export default RecipeDetail;
