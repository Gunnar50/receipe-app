import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderMenu from "./components/Nav/HeaderMenu";
// import Navbar from "./components/Nav/Navbar";
import { AuthenticationForm } from "./components/authentication/AuthForm";
import Home from "./pages/home";
import NotFoundPage from "./pages/notFound/NotFound";
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
			if (user) {
				try {
					const response = await API.get(
						`/auth/validate-session/${user.userId}`
					);
					dispatch(validateSession(response.data.isValid));
				} catch (error) {
					console.log(error);
					dispatch(validateSession(false));
				}
			}
		};
		validateUserSession();
	}, [user]);
	return (
		<>
			<ToastContainer />
			<HeaderMenu />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth/:type" element={<AuthenticationForm />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
}

export default App;
