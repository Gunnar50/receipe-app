import { ActionIcon, Menu, Tooltip, rem } from "@mantine/core";
import { Recipe } from "@pages/Home";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function CardMenu({ recipe }: { recipe: Recipe }) {
	const navigate = useNavigate();

	return (
		<Menu shadow="md" position="bottom-end">
			<Menu.Target>
				<Tooltip label="Options">
					<ActionIcon variant="subtle">
						<IconDots style={{ width: "80%", height: "80%" }} stroke={1.5} />
					</ActionIcon>
				</Tooltip>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item
					onClick={() => navigate(`/recipe/edit/${recipe._id}`)}
					leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
				>
					Edit
				</Menu.Item>
				<Menu.Item
					color="red"
					leftSection={
						<IconTrash style={{ width: rem(14), height: rem(14) }} />
					}
				>
					Delete
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}

export default CardMenu;
