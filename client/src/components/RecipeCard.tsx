import { FaClock, FaHeart, FaUserFriends } from "react-icons/fa";
import { Recipe } from "../pages/home";

interface RecipeProps {
	recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeProps) {
	return (
		<div className="flex border border-gray-200 rounded-lg shadow-md overflow-hidden">
			<img
				src={recipe.image}
				alt={recipe.title}
				className="w-1/3 object-cover"
			/>
			<div className="p-4 flex flex-col justify-between">
				<div>
					<h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
					<div className="flex items-center text-sm text-gray-600 mb-1">
						<FaUserFriends className="mr-2" />
						{recipe.serves} servings
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<FaClock className="mr-2" />
						{recipe.cookingTime} minutes
					</div>
				</div>
				<button className={`flex items-center mt-4 `}>
					<FaHeart className="mr-2" />
					{recipe.likes}
				</button>
			</div>
		</div>
	);
}

export default RecipeCard;
