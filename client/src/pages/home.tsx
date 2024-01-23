import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import API from "../utils/api";

export interface Recipe {
	_id: string;
	title: string;
	ingredients: string[];
	description: string;
	serves: number;
	cookingTime: number;
	ownerId: string;
	likes: number;
	image: string;
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
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{recipes.map((recipe) => (
				<RecipeCard key={recipe._id} recipe={recipe} />
			))}
		</div>
	);
}

export default Home;
