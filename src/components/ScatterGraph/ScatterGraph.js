import React, {useEffect, useState} from 'react';
import {Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend} from 'chart.js';
import {Scatter} from 'react-chartjs-2';
import './ScatterGraph.css';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const ScatterGraph = props => {
	const {datasource} = props;

	const [currentData, setCurrentData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [graphData, setGraphData] = useState({
		datasets: [
			{
				label: 'Account Balance - Tenure',
				data: [],
				backgroundColor: 'rgba(255, 99, 132, 1)',
			},
		],
	});
	const [filters, setFilters] = useState({});

	const graphOptions = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	useEffect(() => {
		datasource(null, null, true).then(resp => {
			setCurrentData(res => resp[0]);
			setFilteredData(res => resp[0]);
		});
	}, []);

	useEffect(() => {
		setGraphData({
			datasets: [
				{
					label: 'Account Balance - Tenure',
					data: filteredData.map(rec => {
						return {x: rec.relationshipTenure, y: rec.accountBalance.slice(2)};
					}),
					backgroundColor: 'rgba(255, 99, 132, 1)',
				},
			],
		});
	}, [filteredData]);

	const qualification = ['M.S', 'Phd', 'B.Tech', 'M.tech', 'Postdoc'];
	const accountType = ['Savings', 'Credit Card', 'Loan', 'OverDraft'];

	const applyFilter = filters => {
		const subSet = currentData.filter(item => {
			const included = true;
			for (let key in filters) {
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
			return included;
		});
		setFilteredData(subSet);
	};
	const handleChange = event => {
		let value = event.target.value;
		if (event.target.multiple) {
			value = Array.from(event.target.selectedOptions, option => option.value);
		}
		setFilters(fil => {
			return {...fil, [event.target.name]: value};
		});
	};

	const handleFilter = event => {
		event.preventDefault();
		console.log(filters);
		applyFilter(filters);
	};

	return (
		<div className="scatter-container">
			<div className="filter-containter">
				<form onSubmit={handleFilter} className="form-filter">
					<fieldset>
						<legend>Filters:</legend>
						<label>State</label>
						<input name="state" onChange={handleChange}></input>
						<label>Qualification</label>
						<select name="qualification" onChange={handleChange}>
							<option value={null}>{''}</option>
							{qualification.map(qual => {
								return <option value={qual}>{qual}</option>;
							})}
						</select>
						<label>Account Type</label>
						<select name="accountType" onChange={handleChange} multiple={true}>
							<option value={null}>{''}</option>
							{accountType.map(qual => {
								return <option value={qual}>{qual}</option>;
							})}
						</select>
						<input type="submit"></input>
					</fieldset>
				</form>
			</div>
			<div className="graph-containter">
				<Scatter className="scatter-graph" options={graphOptions} data={graphData} />
			</div>
		</div>
	);
};

export default ScatterGraph;
// X Axis: RelationShipTenure and YAxis: Account Balance
// data: Array.from({length: 100}, () => ({
// 	x: faker.datatype.number({min: -100, max: 100}),
// 	y: faker.datatype.number({min: -100, max: 100}),
// })),
//  State, Qualification, Account Type
// const accType = ['Savings', 'Credit Card', 'Loan', 'OverDraft'];
// 		const employmentStatus = ['Active', 'Retired', 'Inactive'];
// 		const region = ['APAC', 'EMEA', 'LAD', 'NA'];
// 		const qualification = ['M.S', 'Phd', 'B.Tech', 'M.tech', 'Postdoc'];
