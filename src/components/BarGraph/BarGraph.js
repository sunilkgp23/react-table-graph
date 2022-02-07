import React, {useState, useEffect} from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import faker from '@faker-js/faker';
import './BarGraph.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = props => {
	const {datasource} = props;

	const [currentData, setCurrentData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const region = ['APAC', 'EMEA', 'LAD', 'NA'];
	const [filters, setFilters] = useState({});

	// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

	const [graphData, setGraphData] = useState({
		labels: region,
		datasets: [
			{
				label: 'Average Account Balance',
				data: [],
				backgroundColor: 'rgb(255, 99, 132)',
			},
			{
				label: 'avg(account balance)/avg(tenure)',
				data: [],
				backgroundColor: 'rgb(75, 192, 192)',
			},
		],
	});

	const groupByRegion = records => {
		const result = {};
		for (let i = 0; i < records.length; i++) {
			let rec = records[i];
			if (result[rec.region]) {
				result[rec.region].push(rec);
			} else {
				result[rec.region] = [rec];
			}
		}
		return result;
	};
	useEffect(() => {
		datasource(null, null, true).then(resp => {
			setCurrentData(res => resp[0]);
			setFilteredData(res => groupByRegion(resp[0]));
		});
	}, []);

	const options = {
		plugins: {
			title: {
				display: true,
				text: 'Chart.js Bar Chart - Stacked',
			},
		},
		responsive: true,
		interaction: {
			mode: 'index',
			intersect: false,
		},
	};

	const getAverageData = records => {
		let result = [];
		for (let key in records) {
			result.push(records[key].reduce((a, b) => a + +b.accountBalance.slice(2), 0) / records[key].length);
		}

		return result;
	};

	const getAccTenute = records => {
		let result = [];
		for (let key in records) {
			let avgbal = records[key].reduce((a, b) => a + +b.accountBalance.slice(2), 0) / records[key].length;

			let avgTen = records[key].reduce((a, b) => a + +b.relationshipTenure, 0) / records[key].length;

			result.push(avgbal / avgTen);
		}

		return result;
	};

	useEffect(() => {
		console.log(filteredData);
		setGraphData({
			labels: region,
			datasets: [
				{
					label: 'Average Account Balance',
					data: getAverageData(filteredData),
					backgroundColor: 'rgb(255, 99, 132)',
				},
				{
					label: 'avg(account balance)/avg(tenure)',
					data: getAccTenute(filteredData),
					backgroundColor: 'rgb(75, 192, 192)',
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
		setFilteredData(groupByRegion(subSet));
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
		<div className="bar-container">
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
			<div className="bargraph-containter">
				<Bar className="bar-graph" options={options} data={graphData} />
			</div>
		</div>
	);
};

export default BarGraph;
