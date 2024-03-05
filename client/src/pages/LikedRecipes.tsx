import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecipeCard from "../components/Card/RecipeCard";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import API from "../utils/api";
import { Recipe } from "./Home";

function LikedRecipes() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);
	const dispatch = useDispatch();

	useEffect(() => {
		async function getUserLikedRecipes() {
			if (!isAuth) {
				return;
			}

			try {
				const recipesIds = await API.get(`/recipes/get-like/${user?.userId}`);
				const response = await API.post(
					`/recipes/liked-recipes/${user?.userId}`,
					{ recipesIds: recipesIds.data.likedRecipes }
				);
				setRecipes(response.data.recipes);
			} catch (err) {
				console.log(err);
			}
		}
		getUserLikedRecipes();
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

export default LikedRecipes;
