import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import RecipeCard from "../components/Card/RecipeCard";
import API from "../utils/api";

export interface Recipe {
	_id: string;
	title: string;
	ingredients: string[];
	description: string;
	serves: number;
	cookingTime: number;
	owner: { username: string; _id: string };
	likes: number;
	image: string;
	category: string;
}

function Home() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	useEffect(() => {
		async function getRecipes() {
			try {
				const response = await API.get("/recipes");
				setRecipes(response.data);
			} catch (error) {
				console.log(error);
			}
		}
		getRecipes();
	}, []);

	if (!recipes.length) "Loading...";
	return (
		<>
			<Grid>
				{recipes.map((recipe) => (
					<Grid.Col key={recipe._id} span={{ base: 12, xs: 4 }}>
						<RecipeCard recipe={recipe} />
					</Grid.Col>
				))}
			</Grid>
		</>
	);
}

export default Home;
