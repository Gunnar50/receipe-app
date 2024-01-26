import {
	Box,
	Burger,
	Button,
	Container,
	Divider,
	Drawer,
	Group,
	ScrollArea,
	rem,
} from "@mantine/core";
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
import HeaderMenu from "./Menu";

function Nav() {
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
				<Group h="100%" maw="40rem" m="auto">
					<Group h="100%" justify="space-between" gap={0} w="100%">
						<Link to="/" className={classes.link}>
							Home
						</Link>
						{isAuthenticated ? (
							<>
								<HeaderMenu handleLogout={handleLogout} />
							</>
						) : (
							<Group>
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
							</Group>
						)}
					</Group>
				</Group>
			</header>
		</>
	);
}

export default Nav;
