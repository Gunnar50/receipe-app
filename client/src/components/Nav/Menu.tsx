import {
	Avatar,
	Burger,
	Container,
	Group,
	Menu,
	Tabs,
	Text,
	UnstyledButton,
	rem,
	useMantineTheme,
} from "@mantine/core";
import {
	IconChevronDown,
	IconCirclePlus,
	IconHeart,
	IconList,
	IconLogout,
	IconMessage,
	IconPlayerPause,
	IconSettings,
	IconStar,
	IconSwitchHorizontal,
	IconTrash,
	IconUserFilled,
} from "@tabler/icons-react";
import cx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../../redux/authSlice";
import classes from "./HeaderTabs.module.css";

const user = {
	name: "Jane Spoonfighter",
	email: "janspoon@fighter.dev",
	image:
		"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

interface HeaderMenu {
	handleLogout: () => void;
}

function HeaderMenu({ handleLogout }: HeaderMenu) {
	const theme = useMantineTheme();
	const navigate = useNavigate();
	const [userMenuOpened, setUserMenuOpened] = useState(false);
	const user = useSelector(selectUser);

	return (
		<Menu
			width={260}
			position="bottom-end"
			transitionProps={{ transition: "pop-top-right" }}
			onClose={() => setUserMenuOpened(false)}
			onOpen={() => setUserMenuOpened(true)}
			withinPortal
		>
			<Menu.Target>
				<UnstyledButton
					className={cx(classes.user, {
						[classes.userActive]: userMenuOpened,
					})}
				>
					<Group gap={7}>
						{user && user.image ? (
							<Avatar
								src={user.image}
								alt={user.username}
								radius="xl"
								size={20}
							/>
						) : (
							<IconUserFilled />
						)}
						<Text fw={500} size="sm" lh={1} mr={3}>
							{user ? user.username : "Anonymous"}
						</Text>
						<IconChevronDown
							style={{ width: rem(12), height: rem(12) }}
							stroke={1.5}
						/>
					</Group>
				</UnstyledButton>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					onClick={() => navigate("/create-recipe")}
					leftSection={
						<IconCirclePlus
							style={{ width: rem(16), height: rem(16) }}
							color={theme.colors.green[5]}
							stroke={1.5}
						/>
					}
				>
					Create Recipe
				</Menu.Item>
				<Menu.Item
					onClick={() => navigate("/my-recipes")}
					leftSection={
						<IconList
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
				>
					My Recipes
				</Menu.Item>
				<Menu.Item
					onClick={() => navigate("/liked-recipes")}
					leftSection={
						<IconHeart
							style={{ width: rem(16), height: rem(16) }}
							color={theme.colors.red[6]}
							stroke={1.5}
						/>
					}
				>
					Liked Recipes
				</Menu.Item>
				<Menu.Item
					onClick={() => navigate("/saved-recipes")}
					leftSection={
						<IconStar
							style={{ width: rem(16), height: rem(16) }}
							color={theme.colors.yellow[6]}
							stroke={1.5}
						/>
					}
				>
					Saved Recipes
				</Menu.Item>
				<Menu.Item
					onClick={() => navigate("/comments")}
					leftSection={
						<IconMessage
							style={{ width: rem(16), height: rem(16) }}
							color={theme.colors.blue[6]}
							stroke={1.5}
						/>
					}
				>
					My comments
				</Menu.Item>

				<Menu.Label>Settings</Menu.Label>
				<Menu.Item
					onClick={() => navigate("/settings")}
					leftSection={
						<IconSettings
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
				>
					Account settings
				</Menu.Item>
				<Menu.Item
					onClick={handleLogout}
					leftSection={
						<IconLogout
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
				>
					Logout
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}

export default HeaderMenu;