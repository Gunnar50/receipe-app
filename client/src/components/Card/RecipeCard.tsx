import LikeSaveButton from "@components/LikeSaveButton";
import { Badge, Card, Group, Image, Text } from "@mantine/core";
import { Recipe } from "@pages/Home";
import {
	IconBookmark,
	IconBookmarkFilled,
	IconClock,
	IconHeart,
	IconHeartFilled,
	IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CardMenu from "./CardMenu";
import classes from "./RecipeCard.module.css";

interface RecipeCardProps {
	recipe: Recipe;
	triggerModal?: (type: "login" | "register") => void;
	updateRecipeLikes?: (recipeId: string, newLikesCount: number) => void;
}

function RecipeCard({
	recipe,
	triggerModal,
	updateRecipeLikes,
}: RecipeCardProps) {
	const [isRecipeLiked, setIsRecipeLiked] = useState<boolean>(false);
	const [isRecipeSaved, setIsRecipeSaved] = useState<boolean>(false);

	const HeartIcon = isRecipeLiked ? IconHeartFilled : IconHeart;
	const BookmarkIcon = isRecipeSaved ? IconBookmarkFilled : IconBookmark;

	return (
		<Card padding="md" radius="md" shadow="xl" className={classes.card}>
			<Card.Section>
				<Link to={`/recipe/${recipe._id}`} className={classes.imageContainer}>
					<Image
						className={classes.img}
						src={recipe.image}
						alt={recipe.title}
						height={180}
					/>
				</Link>
			</Card.Section>

			<Card.Section className={classes.content} p="md">
				<Badge w="fit-content" variant="light">
					{recipe.category}
				</Badge>

				<Text fw={700} className={classes.title} mt="xs">
					{recipe.title}
				</Text>

				<Group gap="xs">
					<IconUsers stroke={1.5} size={18} />
					<Text fw={400}>{recipe.serves} servings</Text>
				</Group>

				<Group gap="xs">
					<IconClock stroke={1.5} size={18} />
					<Text fw={400}>{recipe.cookingTime} minutes</Text>
				</Group>

				<Group mt="md" justify="space-between">
					<Text fz="xs" c="dimmed">
						Created by:{" "}
						{recipe.owner?.username ? recipe.owner.username : "Unknown"}
					</Text>
					{!updateRecipeLikes && <CardMenu recipe={recipe} />}
				</Group>

				{updateRecipeLikes && triggerModal && (
					<Card.Section className={classes.footer}>
						<Group justify="space-between">
							<Text fz="xs" c="dimmed">
								{recipe.likes} people liked this
							</Text>
							<Group gap={5}>
								<LikeSaveButton
									type="Like"
									recipeId={recipe._id}
									selected={isRecipeLiked}
									setSelected={setIsRecipeLiked}
									Icon={HeartIcon}
									iconColor="red"
									updateRecipeLikes={updateRecipeLikes}
									triggerModal={triggerModal}
								/>
								<LikeSaveButton
									type="Save"
									recipeId={recipe._id}
									selected={isRecipeSaved}
									setSelected={setIsRecipeSaved}
									Icon={BookmarkIcon}
									updateRecipeLikes={updateRecipeLikes}
									triggerModal={triggerModal}
								/>
							</Group>
						</Group>
					</Card.Section>
				)}
			</Card.Section>
		</Card>
	);
}

export default RecipeCard;
