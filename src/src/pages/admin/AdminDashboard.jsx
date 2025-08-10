import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
	const [users, setUsers] = useState([]);

	const token = localStorage.getItem("token");

	const navigate = useNavigate();

	useEffect(() => {
		async function getUsers() {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_API_URL}/users`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				}
			);

			const data = await response.json();
			if (response.status === 400 || response.status === 401) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				navigate("/login");
			}
			if (response.status === 200 || response.status === 201) {
				setUsers(data.filter((user) => user.role === "user"));
			}
		}
		getUsers();
	}, []);

	return (
		<div className="mt-16 p-6">
			<div>
				<div className="flex flex-row justify-between">
					<div>Users</div>
					<div>
						<Link
							className="text-white bg-primary hover:bg-accent transition duration-300 rounded px-4 py-2"
							to="/admin/user/create"
						>
							Create New User
						</Link>
					</div>
				</div>
				<div className="mt-6 p-4">
					<table className="w-full">
						<thead>
							<tr>
								<th className="text-center p-2">Name</th>
								<th className="text-center p-2">Email</th>
								<th className="text-center p-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.length > 0 &&
								users.map((user) => (
									<tr key={user.id} className="m-2">
										<td className="text-center p-2 m-2">
											{user.name}
										</td>
										<td className="text-center p-2 m-2">
											{user.email}
										</td>
										<td className="text-center p-2 m-2">
											<Link
												className="text-white bg-primary hover:bg-accent transition duration-300 rounded px-6 py-2 m-2"
												to={`/admin/user/${user.id}`}
											>
												View
											</Link>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
