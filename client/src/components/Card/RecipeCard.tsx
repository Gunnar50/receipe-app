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
import { IconBookmark, IconHeart, IconShare } from "@tabler/icons-react";
import { Recipe } from "../../pages/Home";
import classes from "./RecipeCard.module.css";
interface RecipeCardProps {
	key: string;
	recipe: Recipe;
}

function RecipeCard({ key, recipe }: RecipeCardProps) {
	const theme = useMantineTheme();

	return (
		<Card
			key={key}
			withBorder
			padding="lg"
			radius="md"
			className={classes.card}
		>
			<Card.Section mb="sm">
				<a href="#">
					<Image src={recipe.image} alt={recipe.title} height={180} />
				</a>
			</Card.Section>

			<Badge w="fit-content" variant="light">
				pastry
			</Badge>

			<Text fw={700} className={classes.title} mt="xs">
				{recipe.title}
			</Text>

			<Group mt="lg">
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
		</Card>
	);
}

export default RecipeCard;
