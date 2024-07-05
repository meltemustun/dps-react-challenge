import React from 'react';

export default function UserList({ users, oldestUsers, highlightOldest }) {
	return (
		<>
			<table>
				<tr>
					<th>Name</th>
					<th>City</th>
					<th>Birthday</th>
				</tr>
				{users.map((item: any) => {
					return (
						<tr
							className={
								highlightOldest &&
								oldestUsers.get(item.city) === item.id
									? 'highlight'
									: ''
							}
						>
							<td>
								{item.firstName} {item.lastName}
							</td>
							<td>{item.city}</td>
							<td>{item.birthDate}</td>
						</tr>
					);
				})}
			</table>
		</>
	);
}
