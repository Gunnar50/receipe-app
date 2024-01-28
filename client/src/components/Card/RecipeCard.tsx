import {
	ActionIcon,
	Avatar,
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
import { Recipe } from "../../pages/Home";
import classes from "./RecipeCard.module.css";
interface RecipeCardProps {
	recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
	const theme = useMantineTheme();

	return (
		<Card withBorder padding="lg" radius="md" className={classes.card}>
			<Card.Section>
				<a href="#" className={classes.imageContainer}>
					<Image
						className={classes.img}
						src={recipe.image}
						alt={recipe.title}
						height={180}
					/>
				</a>
			</Card.Section>

			<Card.Section className={classes.content} p="lg">
				<Badge w="fit-content" variant="light">
					pastry
				</Badge>

				<Text fw={700} className={classes.title} mt="xs">
					{recipe.title}
				</Text>

				<Group gap="xs">
					<IconUsers stroke={1.5} size={18} />
					<Text fw={400}>{recipe.serves} 2 servings</Text>
				</Group>

				<Group gap="xs">
					<IconClock stroke={1.5} size={18} />
					<Text fw={400}>{recipe.cookingTime} minutes</Text>
				</Group>

				<Group mt="md">
					<div>
						<Text fz="xs" c="dimmed">
							Created by: Test
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
