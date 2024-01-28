import { Button, Group } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CreateRecipe from "../../pages/CreateRecipe";
import {
	logout,
	selectIsAuthenticated,
	selectUser,
} from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import AuthenticationForm from "../authentication/AuthForm";
import CustomModal from "./CustomModal";
import classes from "./HeaderMenu.module.css";
import HeaderMenu from "./Menu";

type AuthType = "login" | "register";

function Nav() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [type, toggle] = useToggle<AuthType>(["login", "register"]);
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const [openedAuth, { open: openAuth, close: closeAuth }] =
		useDisclosure(false);
	const [
		openedCreateRecipe,
		{ open: openCreateRecipe, close: closeCreateRecipe },
	] = useDisclosure(false);
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
				navigate("/auth/login");
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
				<CustomModal
					title={`Welcome to RecipesApp, please ${type}`}
					opened={openedAuth}
					close={closeAuth}
				>
					<AuthenticationForm
						type={type}
						toggleType={toggle}
						closeModal={closeAuth}
					/>
				</CustomModal>
				<CustomModal
					title="Create a new Recipe!"
					opened={openedCreateRecipe}
					close={closeCreateRecipe}
				>
					<CreateRecipe />
				</CustomModal>

				<Group h="100%" maw="40rem" m="auto">
					<Group h="100%" justify="space-between" gap={0} w="100%">
						<Link to="/" className={classes.link}>
							Home
						</Link>
						{isAuthenticated ? (
							<>
								<HeaderMenu
									openCreateRecipe={openCreateRecipe}
									handleLogout={handleLogout}
								/>
							</>
						) : (
							<Group>
								<Button
									className={classes.button}
									variant="default"
									onClick={() => {
										toggle("login");
										openAuth();
									}}
								>
									Log in
								</Button>
								<Button
									className={classes.button}
									onClick={() => {
										toggle("register");
										openAuth();
									}}
								>
									Sign up
								</Button>
							</Group>
						)}
					</Group>
				</Group>
			</header>
		</>
	);
}

export default Nav;
