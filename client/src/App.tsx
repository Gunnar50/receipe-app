import { Container } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomModal from "./components/Nav/CustomModal";
import Nav from "./components/Nav/Nav";
import AuthenticationForm, {
	AuthType,
} from "./components/authentication/AuthForm";
import Home from "./pages/Home";
import LikedRecipes from "./pages/LikedRecipes";
import NotFoundPage from "./pages/NotFound/NotFound";
import RecipeDetail from "./pages/RecipeDetail";
import {
	selectIsAuthenticated,
	selectUser,
	validateSession,
} from "./redux/authSlice";
import { selectContent, setContent } from "./redux/toastSlice";
import API from "./utils/api";

function App() {
	const dispatch = useDispatch();
	const toastContent = useSelector(selectContent);
	const user = useSelector(selectUser);
	const [type, toggle] = useToggle<AuthType>(["login", "register"]);
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const [openedAuth, { open: openAuth, close: closeAuth }] =
		useDisclosure(false);

	function triggerModal(type: "login" | "register") {
		toggle(type);
		openAuth();
	}

	useEffect(() => {
		if (toastContent.text) {
			if (toastContent.type == "success") {
				toast.success(toastContent.text);
			}
			if (toastContent.type == "error") {
				toast.error(toastContent.text);
			}
			dispatch(setContent({ text: "", type: "" }));
		}
	}, [toastContent]);

	useEffect(() => {
		if (!isAuthenticated) return;
		const validateUserSession = async () => {
			try {
				const response = await API.get(
					`/auth/validate-session/${user?.userId}`
				);
				dispatch(validateSession(response.data.isValid));
			} catch (error) {
				dispatch(validateSession(false));
			}
		};
		validateUserSession();
	}, [user, isAuthenticated]);
	return (
		<>
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
			{/* <ToastContainer /> */}
			<Nav triggerModal={triggerModal} />
			<Container my="md">
				<Routes>
					<Route path="/" element={<Home triggerModal={triggerModal} />} />
					<Route
						path="/recipe/:recipeId"
						element={<RecipeDetail triggerModal={triggerModal} />}
					/>
					<Route path="/liked-recipes" element={<LikedRecipes />} />
					{/* <Route path="/create-recipe" /> */}
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Container>
		</>
	);
}

export default App;
