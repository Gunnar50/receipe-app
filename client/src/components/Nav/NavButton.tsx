import { Link } from "react-router-dom";

interface Button {
	label: string;
	to?: string;
	extraClass?: string;
	handleClick?: () => void;
}

function NavButton({
	label,
	to = "",
	handleClick = () => {},
	extraClass = "",
}: Button) {
	return (
		<Link
			className={`px-4 py-2 text-gray-200 hover:text-white
			 transition duration-200 mr-2 ${extraClass}`}
			to={to}
			onClick={handleClick}
		>
			{label}
		</Link>
	);
}

export default NavButton;
