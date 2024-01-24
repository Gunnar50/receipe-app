import {
	Box,
	Burger,
	Button,
	Divider,
	Drawer,
	Group,
	ScrollArea,
	rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
	logout,
	selectIsAuthenticated,
	selectUser,
} from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import classes from "./HeaderMenu.module.css";

function HeaderMenu() {
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	async function handleLogout() {
		try {
			if (isAuthenticated) {
				const response = await API.get(`/auth/logout/${user?.userId}`);
				const { message } = response.data;
				dispatch(logout());
				dispatch(
					setContent({
						text: message,
						type: "success",
					})
				);
				navigate("/auth/register");
			}
		} catch (error) {
			console.log(error);
			dispatch(
				setContent({
					text: "Something went wrong while logging out.",
					type: "error",
				})
			);
		}
	}

	return (
		<>
			<header className={classes.header}>
				<Group justify="space-between" h="100%" maw="40rem" m="auto">
					<Group h="100%" gap={0} visibleFrom="xs">
						<Link to="/" className={classes.link}>
							Home
						</Link>
						{isAuthenticated && (
							<>
								<Link to="/create-recipe" className={classes.link}>
									Create Recipe
								</Link>
								<Link to="/saved" className={classes.link}>
									Favourite Recipes
								</Link>
							</>
						)}
					</Group>

					<Group visibleFrom="xs">
						{!isAuthenticated ? (
							<>
								<Button
									className={classes.button}
									variant="default"
									onClick={() => navigate("/auth/login")}
								>
									Log in
								</Button>
								<Button
									className={classes.button}
									onClick={() => navigate("/auth/register")}
								>
									Sign up
								</Button>
							</>
						) : (
							<Button className={classes.button} onClick={handleLogout}>
								Logout
							</Button>
						)}
					</Group>

					<Burger
						opened={drawerOpened}
						onClick={toggleDrawer}
						hiddenFrom="xs"
					/>
				</Group>
			</header>

			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				size="100%"
				padding="md"
				title="Navigation"
				hiddenFrom="xs"
				zIndex={1000000}
			>
				<ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
					<Divider my="sm" />

					<a href="#" className={classes.link}>
						Home
					</a>
					<a href="#" className={classes.link}>
						Learn
					</a>
					<a href="#" className={classes.link}>
						Academy
					</a>

					<Divider my="sm" />

					<Group justify="center" grow pb="xl" px="md">
						<Button variant="default">Log in</Button>
						<Button>Sign up</Button>
					</Group>
				</ScrollArea>
			</Drawer>
		</>
	);
}

export default HeaderMenu;
