import {
	ActionIcon,
	Badge,
	Card,
	Group,
	Image,
	Text,
	rem,
	useMantineTheme,
} from "@mantine/core";
import {
	IconBookmark,
	IconClock,
	IconHeart,
	IconShare,
	IconUsers,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Recipe } from "../../pages/Home";
import classes from "./RecipeCard.module.css";
interface RecipeCardProps {
	recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
	const theme = useMantineTheme();

	return (
		<Card
			// withBorder
			padding="md"
			radius="md"
			shadow="xl"
			className={classes.card}
		>
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
					pastry
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

				<Group mt="md">
					<div>
						<Text fz="xs" c="dimmed">
							Created by:{" "}
							{recipe.owner?.username ? recipe.owner.username : "Unknown"}
						</Text>
					</div>
				</Group>

				<Card.Section className={classes.footer}>
					<Group justify="space-between">
						<Text fz="xs" c="dimmed">
							{recipe.likes} people liked this
						</Text>
						<Group gap={0}>
							<ActionIcon variant="subtle" color="gray">
								<IconHeart
									style={{ width: rem(20), height: rem(20) }}
									color={theme.colors.red[6]}
									stroke={1.5}
								/>
							</ActionIcon>
							<ActionIcon variant="subtle" color="gray">
								<IconBookmark
									style={{ width: rem(20), height: rem(20) }}
									color={theme.colors.yellow[6]}
									stroke={1.5}
								/>
							</ActionIcon>
							<ActionIcon variant="subtle" color="gray">
								<IconShare
									style={{ width: rem(20), height: rem(20) }}
									color={theme.colors.blue[6]}
									stroke={1.5}
								/>
							</ActionIcon>
						</Group>
					</Group>
				</Card.Section>
			</Card.Section>
		</Card>
	);
}

export default RecipeCard;
