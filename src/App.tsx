import { useEffect, useState } from 'react';
import './App.css';
import Select from 'react-select';
import UserList from './components/UserList';
import moment, { max } from 'moment';

type User = {
	id: number;
	firstName: string;
	lastName: string;
	city: string;
	birthDate: string;
};

type CityOptions = {
	value: string;
	label: string;
};

enum FilterType {
	BY_NAME,
	BY_CITY,
}

function App() {
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [oldestUsers, setOldestUsers] = useState({});
	const [cityOptions, setCityOptions] = useState<CityOptions[]>([]);
	const [nameFilter, setNameFilter] = useState('');
	const [cityFilter, setCityFilter] = useState('');
	const [highlightOldest, setHighlightOldest] = useState(false);

	useEffect(() => {
		const extractUsers = (data: any): User[] => {
			return data.map((item: any) => ({
				key: item.id,
				id: item.id,
				firstName: item.firstName,
				lastName: item.lastName,
				city: item.address.city,
				birthDate: moment(item.birthDate).format('DD.MM.YYYY'),
			}));
		};

		const fetchUsers = async () => {
			const res = await fetch('https://dummyjson.com/users');
			const data = await res.json();
			const parsedUsers = extractUsers(data.users);
			setUsers(parsedUsers);
			setFilteredUsers(parsedUsers);
			setCityOptions(
				Array.from(
					new Set(parsedUsers.map((user: any) => user.city))
				).map((city) => {
					return { value: city, label: city };
				})
			);
		};

		if (nameFilter === '' && cityFilter === '') fetchUsers();
	}, [nameFilter]);

	const handleFilter = (type: FilterType, name: string, city: string) => {
		if (type === FilterType.BY_CITY) {
			setCityFilter(city);
			applyCityFilter(city);
			if (nameFilter !== '') applyCombinedFilter(city, nameFilter);
		} else if (type === FilterType.BY_NAME) {
			if (name !== '') {
				setNameFilter(name.toLowerCase());
				if (cityFilter !== '') {
					applyCombinedFilter(cityFilter, name);
				} else {
					applyNameFilter(name);
					setCityOptions(
						Array.from(
							new Set(filteredUsers.map((user: any) => user.city))
						).map((city) => {
							return { value: city, label: city };
						})
					);
				}
			} else {
				setNameFilter('');
				applyCityFilter(cityFilter);
			}
		}
	};

	const applyNameFilter = (name: string) => {
		setFilteredUsers(
			users.filter(
				(user) =>
					user.firstName.toLowerCase().includes(name) ||
					user.lastName.toLowerCase().includes(name)
			)
		);
	};

	const applyCityFilter = (city: string) => {
		setFilteredUsers(users.filter((user) => user.city === city));
	};

	const applyCombinedFilter = (city: string, name: string) => {
		setFilteredUsers(
			users
				.filter(
					(user) =>
						user.firstName.toLowerCase().includes(name) ||
						user.lastName.toLowerCase().includes(name)
				)
				.filter((user) => user.city === city)
		);
	};

	const handleHighlightOldest = () => {
		setHighlightOldest((current) => !current);
		const cities = new Set(filteredUsers.map((user: any) => user.city));
		const oldestUsersMap = new Map<string, number>();
		cities.forEach((city) => {
			const cityUsers = filteredUsers.filter(
				(user) => user.city === city
			);
			let maxAge = 0;
			cityUsers.forEach((user) => {
				const age = moment(new Date(), 'DD.MM.YYYY').diff(
					moment(user.birthDate, 'DD.MM.YYYY'),
					'seconds'
				);
				if (age >= maxAge) {
					maxAge = age;
					console.log('Max age:' + maxAge);
					oldestUsersMap.set(city, user.id);
				}
			});
		});
		setOldestUsers(oldestUsersMap);
	};

	return (
		<>
			<div className="container">
				<div className="form-group">
					<label>
						Name
						<input
							type="text"
							value={nameFilter}
							onChange={(e) =>
								handleFilter(
									FilterType.BY_NAME,
									e.target.value,
									''
								)
							}
						></input>
					</label>
					<label>
						City
						<div className="select">
							<Select
								placeholder="Select city"
								options={cityOptions}
								isSearchable={false}
								onChange={(choice) =>
									handleFilter(
										FilterType.BY_CITY,
										'',
										choice.value
									)
								}
							></Select>
						</div>
					</label>
					<div className="checkbox-container">
						<label>Highlight oldest per city</label>
						<input
							type="checkbox"
							checked={highlightOldest}
							onChange={handleHighlightOldest}
						></input>
					</div>
				</div>
				<UserList
					users={filteredUsers}
					oldestUsers={oldestUsers}
					highlightOldest={highlightOldest}
				/>
			</div>
		</>
	);
}

export default App;
