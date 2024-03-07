import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecipeCard from "../components/Card/RecipeCard";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import API from "../utils/api";
import { Recipe } from "./Home";

function SavedRecipes() {
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
				const responseIds = await API.get(`/recipes/get-save/${user?.userId}`);
				const response = await API.post(
					`/recipes/saved-recipes/${user?.userId}`,
					{ recipesIds: responseIds.data.savedRecipes }
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

export default SavedRecipes;
