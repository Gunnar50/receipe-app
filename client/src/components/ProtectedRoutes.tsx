import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "../redux/authSlice";

function ProtectedRoutes({
	triggerModal,
}: {
	triggerModal: (type: "login" | "register") => void;
}) {
	const isAuth = useSelector(selectIsAuthenticated);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuth) {
			navigate("/");
			triggerModal("login");
		}
	}, [isAuth, navigate, triggerModal]);

	return <>{isAuth && <Outlet />}</>;
}

export default ProtectedRoutes;
