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
		<Grid>
			<Grid.Col span={{ xs: 5 }}>
				<Image
					src={recipe.image}
					alt="Honey Roasted Peanut Butter"
					style={{ width: "100%", height: "auto" }}
				/>
			</Grid.Col>
			<Grid.Col span={{ xs: 7 }}>
				<Stack gap="xl">
					<Group wrap="nowrap" align="flex-start" justify="space-between">
						<Title order={2}>Honey Roasted Peanut Butter</Title>
						<Button variant="light" color="blue" radius="md">
							Save
						</Button>
					</Group>

					<Text size="sm" style={{ marginBottom: "md" }}>
						by{" "}
						<span style={{ fontWeight: 500 }}>
							{recipe.owner?.username ? recipe.owner.username : "Unknown"}
						</span>
					</Text>

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
		</Grid>
	);

	// 	return (
	// 		<Grid justify="center" style={{ marginTop: "20px" }}>
	// 			<Grid.Col span={{ xs: 12, md: 10 }}>
	// 				<Group justify="apart" style={{ marginBottom: "20px" }}>
	// 					<Image
	// 						src={recipe.image}
	// 						alt="Recipe"
	// 						style={{ maxWidth: "350px", borderRadius: "5px" }}
	// 					/>

	// 					<Box
	// 						style={{
	// 							flex: 1,
	// 							marginLeft: "20px",
	// 							marginRight: "20px",
	// 							minWidth: "300px",
	// 						}}
	// 					>
	// 						<Title order={2}>{recipe.title}</Title>
	// 						<Text>
	// 							by{" "}
	// 							<strong>
	// 								{recipe.owner?.username ? recipe.owner.username : "Unknown"}
	// 							</strong>
	// 						</Text>
	// 						<Grid>
	// 							<Grid.Col span={4}></Grid.Col>
	// 							<Grid.Col span={4}></Grid.Col>
	// 							<Grid.Col span={4}></Grid.Col>
	// 						</Grid>
	// 						{/* <Text>
	// 							<strong>Cooking Time: </strong>
	// 							{recipe.cookingTime} minutes
	// 						</Text> */}
	// 					</Box>
	// 				</Group>

	// 				<Group justify="apart" style={{ marginTop: "40px" }}>
	// 					<Box style={{ flex: 1, marginLeft: "20px", marginRight: "20px" }}>
	// 						<Title order={3}>Ingredients</Title>
	// 						<ul>
	// 							{recipe.ingredients.map((item, idx) => (
	// 								<li key={idx}>{item}</li>
	// 							))}
	// 						</ul>
	// 					</Box>

	// 					<Box style={{ flex: 2, marginLeft: "20px", marginRight: "20px" }}>
	// 						<Title order={3}>Description</Title>
	// 						<Text>{recipe.description}</Text>
	// 					</Box>
	// 				</Group>
	// 			</Grid.Col>
	// 		</Grid>
	// 	);
	// }
}

export default RecipeDetail;
