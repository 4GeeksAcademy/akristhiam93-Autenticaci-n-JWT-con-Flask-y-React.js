import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {

	const navigate = useNavigate();

	const token = sessionStorage.getItem("token");

	const handleLogout = () => {

		sessionStorage.removeItem("token");

		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">

				<div>

					{token ? (

						<button
							className="btn btn-danger me-2"
							onClick={handleLogout}>
							Logout
						</button>

					) : (

						<Link to="/login">
							<button className="btn btn-success me-2">
								Login
							</button>
						</Link>

					)}

				</div>

				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						React Boilerplate
					</span>
				</Link>

				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">
							Check the Context in action
						</button>
					</Link>
				</div>

			</div>
		</nav>
	);
};