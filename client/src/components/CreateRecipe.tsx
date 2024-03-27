import { Paper, Title } from "@mantine/core";
import RecipeForm from "./RecipeForm";

function CreateRecipe() {
	return (
		<Paper>
			<Title mb={"2rem"} order={2}>
				Create New Recipe
			</Title>

			<RecipeForm type="create" />
		</Paper>
	);
}
export default CreateRecipe;
