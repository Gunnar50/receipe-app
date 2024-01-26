import { Container } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./components/Nav/Nav";
import AuthenticationForm from "./components/authentication/AuthForm";
import CreateRecipe from "./pages/CreateRecipe";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFound/NotFound";
import { selectUser, validateSession } from "./redux/authSlice";
import { selectContent, setContent } from "./redux/toastSlice";
import API from "./utils/api";

function App() {
	const dispatch = useDispatch();
	const toastContent = useSelector(selectContent);
	const user = useSelector(selectUser);

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
		const validateUserSession = async () => {
			try {
				const response = await API.get(
					`/auth/validate-session/${user?.userId}`
				);
				dispatch(validateSession(response.data.isValid));
			} catch (error) {
				console.log(error);
				dispatch(validateSession(false));
			}
		};
		validateUserSession();
	}, [user]);
	return (
		<>
			<ToastContainer />
			<Nav />
			<Container my="md">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/auth/:type" element={<AuthenticationForm />} />
					<Route path="/create-recipe" element={<CreateRecipe />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Container>
		</>
	);
}

export default App;
