import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
	logout,
	selectIsAuthenticated,
	selectUser,
} from "../../redux/authSlice";
import { setContent } from "../../redux/toastSlice";
import API from "../../utils/api";
import NavButton from "./NavButton";

function Navbar() {
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
				navigate("/");
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
		<nav className="bg-teal-900 p-4 text-white flex items-center justify-center">
			<NavButton label="Home" to="/" extraClass="font-semibold" />

			{!isAuthenticated ? (
				<NavButton label="Login/Register" to="/auth" />
			) : (
				<>
					<NavButton label="Create Recipe" to="/create-recipe" />
					<NavButton label="Favourite Recipes" to="/saved" />
					<NavButton label="My Recipes" to="/my-recipes" />
					<NavButton label="Logout" handleClick={handleLogout} />
				</>
			)}
		</nav>
	);
}

export default Navbar;
