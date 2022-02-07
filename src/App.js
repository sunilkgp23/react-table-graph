import './App.css';
import {useEffect, useState} from 'react';
import faker from '@faker-js/faker';
import Table from './components/Table/Table';
import {v4 as uuid} from 'uuid';
import ScatterGraph from './components/ScatterGraph/ScatterGraph';
import BarGraph from './components/BarGraph/BarGraph';
import Navbar from './components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

let GLOBAL = null;
function App() {
	const [records, setRecords] = useState([]);
	const [dataFetched, setDataFetched] = useState(false);

	const backendImp = async () => {
		const dataSet = [];
		const MAX_SET = 10000; //5000000;
		GLOBAL = faker;
		const accType = ['Savings', 'Credit Card', 'Loan', 'OverDraft'];
		const employmentStatus = ['Active', 'Retired', 'Inactive'];
		const region = ['APAC', 'EMEA', 'LAD', 'NA'];
		const qualification = ['M.S', 'Phd', 'B.Tech', 'M.tech', 'Postdoc'];


		for (let i = 0; i < MAX_SET; i++) {
			let card = faker.helpers.createCard();
			dataSet[i] = {
				customerId: uuid(),
				customerName: card.name,
				age: faker.datatype.number({min: 18, max: 60}),
				qualification: qualification[faker.datatype.number({min: 0, max: qualification.length - 1})],
				income: '' + faker.datatype.number({min: 20000, max: 80000}),
				workExp: faker.datatype.number({min: 0, max: 40}) + ' years',
				numOfHousehold: faker.datatype.number({min: 1, max: 5}),
				region: region[faker.datatype.number({min: 0, max: region.length - 1})],
				state: card.address.state,
				address: card.address.city,
				accountBalance: '' + faker.datatype.number({min: 50000, max: 2000000}),
				numOfAccount: faker.datatype.number({min: 1, max: 10}),
				accountType: accType[faker.datatype.number({min: 0, max: accType.length - 1})],
				relationshipTenure: faker.datatype.number({min: 0, max: 20}),
				employmentStatus: employmentStatus[faker.datatype.number({min: 0, max: employmentStatus.length - 1})],
			};
		}
		return dataSet;
	};

	const applyFilter = filters => {
		const subSet = records.filter(item => {
			let included = true;
			let isCustomFilter = false;
			for (let key in filters) {
				if (key === 'CustomFilter') {
					isCustomFilter = true;
					continue;
				}
				let filterValue = filters[key];
				if (filterValue === '') {
					continue;
				}
				if (Array.isArray(filterValue)) {
					if (!filters[key].includes(item[key])) {
						return false;
					}
				} else {
					if (!item[key].toLowerCase().includes(filterValue.toLowerCase())) {
						return false;
					}
				}
			}
			if (isCustomFilter && included) {
				let {property, critaria, propValue} = filters['CustomFilter'];
				included = eval(item[property] + critaria + propValue);
			}
			return included;
		});
		return subSet;
	};

	const getData = async (top, skip, isAll, filters) => {
		if (!dataFetched) {
			const data = await backendImp();
			setRecords(() => data);
			setDataFetched(val => !val);
			if (isAll) {
				return [data];
			} else {
				return [data.slice(skip, top), skip + top < data.length];
			}
		}
		if (isAll) {
			return [records];
		} else {
			if (Object.keys(filters)) {
				let recs = applyFilter(filters);
				return [recs.slice(skip, skip + top), skip + top < recs.length];
			} else {
				return [records.slice(skip, skip + top), skip + top < records.length];
			}
		}
	};

	const getFiltered = (filters, top, skip) => {};

	const columns = [
		{id: uuid(), key: 'customerName', label: 'Customer Name', isSearchable: false},
		{id: uuid(), key: 'age', label: 'Age', isSearchable: false},
		{id: uuid(), key: 'qualification', label: 'Qualification', isSearchable: false},
		{id: uuid(), key: 'income', label: 'Income(in $)', isSearchable: true},
		{id: uuid(), key: 'workExp', label: 'Work Experience', isSearchable: false},
		{id: uuid(), key: 'numOfHousehold', label: 'Houses', isSearchable: false},
		{id: uuid(), key: 'region', label: 'Region', isSearchable: true},
		{id: uuid(), key: 'state', label: 'State', isSearchable: true},
		{id: uuid(), key: 'address', label: 'City', isSearchable: true},
		{id: uuid(), key: 'accountBalance', label: 'Account Balance(in $)', isSearchable: true},
		{id: uuid(), key: 'numOfAccount', label: 'Total Accounts', isSearchable: false},
		{id: uuid(), key: 'accountType', label: 'Type of Account', isSearchable: true, options: ['Savings', 'Credit Card', 'Loan', 'OverDraft']},
		{id: uuid(), key: 'relationshipTenure', label: 'RelationShip Tenure', isSearchable: false},
		{id: uuid(), key: 'employmentStatus', label: 'Employment Status', isSearchable: false},
	];

	return (
		<BrowserRouter>
			<div className="App">
				<Navbar />
				<Routes>
					<Route exact path="/" element={<Table columns={columns} pageSize={50} datasource={getData} getFiltered={getFiltered} />}></Route>
					<Route path="/scatter" element={<ScatterGraph datasource={getData} />}></Route>
					<Route path="/bar" element={<BarGraph datasource={getData} />}></Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;