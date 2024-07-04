import { useEffect, useState } from 'react';
import './App.css';
import Select from 'react-select';
import UserList from './components/UserList';
import moment from 'moment';

// https://dummyjson.com/users

//firstName,lastName
//adress-city
//birthDate

type User = {
	firstName: string;
	lastName: string;
	city: string;
	birthDate: string;
};

type CityOptions = {
	value: string;
	label: string;
};

function App() {
	const [users, setUsers] = useState<User[]>([]);
	const [cityOptions, setCityOptions] = useState<CityOptions[]>([]);

	useEffect(() => {
		const extractUsers = (data: any): User[] => {
			return data.map((item) => ({
				key: item.id,
				firstName: item.firstName,
				lastName: item.lastName,
				city: item.address.city,
				birthDate: moment(item.birthDate).format('DD.MM.YYYY'),
			}));
		};

		const fetchUsers = async () => {
			const res = await fetch(
				'https://a91c6baa-857a-42f9-b1d9-bc63de09dfb5.mock.pstmn.io/newUsers'
			);
			const data = await res.json();
			setUsers(extractUsers(data.users));

			setCityOptions(
				Array.from(new Set(users.map((user: any) => user.city))).map(
					(city) => {
						return { value: city, label: city };
					}
				)
			);
		};

		fetchUsers();
		console.log(users);
	}, []);

	return (
		<>
			<div className="container">
				<p>Name</p>
				<input className="search-section" type="text"></input>
				<p>City</p>

				<Select
					placeholder="Select city"
					options={cityOptions}
				></Select>
				<p>Highlight oldest per city</p>
				<input type="checkbox"></input>
			</div>

			<UserList users={users} />
		</>
	);
}

export default App;
