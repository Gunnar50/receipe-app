import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RecipeCard from "../components/Card/RecipeCard";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import API from "../utils/api";
import { Recipe } from "./Home";

function MyRecipes() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	useEffect(() => {
		async function getUserRecipes() {
			if (!isAuth) {
				return;
			}

			try {
				const response = await API.get(
					`/recipes/get-user-recipes/${user?.userId}`
				);
				console.log(response.data);
				setRecipes(response.data);
			} catch (err) {
				console.log(err);
			}
		}
		getUserRecipes();
	}, [isAuth, user]);

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

export default MyRecipes;
