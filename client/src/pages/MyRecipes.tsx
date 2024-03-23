import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/Card/RecipeCard";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";
import API from "../utils/api";
import { handleError } from "../utils/handleError";
import { Recipe } from "./Home";

function MyRecipes() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const isAuth = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);
	const navigate = useNavigate();

	useEffect(() => {
		async function getUserRecipes() {
			if (!isAuth && !user) {
				return;
			}

			try {
				const response = await API.get(
					`/recipes/get-user-recipes/${user?.userId}`
				);
				setRecipes(response.data);
			} catch (error: unknown) {
				handleError(error);
				navigate("/");
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
