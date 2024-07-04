import React from 'react';

export default function UserList({ users }) {
	return (
		<div>
			<table>
				<tr>
					<th>Name</th>
					<th>City</th>
					<th>Birthday</th>
				</tr>
				{users.map((item) => {
					return (
						<tr>
							<td>
								{item.firstName} {item.lastName}
							</td>
							<td>{item.city}</td>
							<td>{item.birthDate}</td>
						</tr>
					);
				})}
			</table>
		</div>
	);
}
