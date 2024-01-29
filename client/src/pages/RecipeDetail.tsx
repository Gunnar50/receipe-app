import {
	Box,
	Button,
	Card,
	Grid,
	Group,
	Image,
	Text,
	Textarea,
	Title,
} from "@mantine/core";
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
		<Grid justify="center" style={{ marginTop: "20px" }}>
			<Grid.Col span={{ xs: 12, md: 10 }}>
				<Card>
					<Group justify="apart" style={{ marginBottom: "20px" }}>
						<Image
							src={recipe.image}
							alt="Recipe"
							style={{ maxWidth: "300px" }}
						/>

						<Box style={{ flex: 2, marginLeft: "20px", marginRight: "20px" }}>
							<Title order={1}>{recipe.title}</Title>
							<Text>
								<strong>Cooking Time: </strong>
								{recipe.cookingTime} minutes
							</Text>
							<Text>
								<strong>Author: </strong>
								{recipe.owner?.username ? recipe.owner.username : "Unknown"}
							</Text>
						</Box>
					</Group>

					<Group justify="apart" style={{ marginTop: "40px" }}>
						<Box style={{ flex: 1, marginLeft: "20px", marginRight: "20px" }}>
							<Title order={3}>Ingredients</Title>
							<ul>
								{recipe.ingredients.map((item, idx) => (
									<li key={idx}>{item}</li>
								))}
							</ul>
						</Box>

						<Box style={{ flex: 2, marginLeft: "20px", marginRight: "20px" }}>
							<Title order={3}>Description</Title>
							<Text>{recipe.description}</Text>
						</Box>
					</Group>
				</Card>
			</Grid.Col>
		</Grid>
	);
}

export default RecipeDetail;
