import {useEffect, useState} from 'react';
import './Table.css';
import {v4 as uuid} from 'uuid';

const Table = props => {
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const [currentData, SetCurrentData] = useState([]);
	const [filters, setFilters] = useState({});
	const [custFilters, setCustFilters] = useState({property: 'age', critaria: '>', propValue: null});
	const {columns, datasource, pageSize, getFiltered} = props;

	useEffect(() => {
		datasource(pageSize, (page - 1) * pageSize, null, filters).then(data => {
			SetCurrentData(res => data[0]);
			setHasMore(data[1]);
		});
	}, [page, filters]);

	const decreasePage = () => {
		if (page > 1) {
			setPage(ct => ct - 1);
		}
	};

	const IncreasePage = () => {
		setPage(ct => ct + 1);
	};

	const handleSubmit = (event, col) => {
		if (event.code === 'Enter') {
			event.preventDefault();
			console.log(event.target.value, col);
			setPage(1);
			setFilters(fil => {
				return {...fil, [col.key]: event.target.value};
			});
		}
	};

	const handleChange = (event, col) => {
		setPage(1);
		setFilters(fil => {
			return {...fil, [col.key]: event.target.value};
		});
	};

	const handleFilter = event => {
		event.preventDefault();

		setPage(1);
		setFilters(fil => {
			return {...fil, CustomFilter: custFilters};
		});
	};

	const handleReset = event => {
		event.preventDefault();
		setPage(1);
		setFilters(res => {
			delete res.CustomFilter;
			return {...res};
		});
	};
	const handleCustomChange = event => {
		event.preventDefault();
		setCustFilters(fil => {
			return {...fil, [event.target.name]: event.target.value};
		});
	};
	const comparitions = [
		{
			id: uuid(),
			label: '>',
			value: '>',
			isDefault: true,
		},
		{
			id: uuid(),
			label: '>=',
			value: '>=',
		},
		{
			id: uuid(),
			label: '<',
			value: '<',
		},
		{
			id: uuid(),
			label: '<=',
			value: '<',
		},
	];
	return (
		<div className="table-container">
			<button disabled={page === 1} onClick={decreasePage}>
				Previous
			</button>
			{page}
			<button disabled={!hasMore} onClick={IncreasePage}>
				Next
			</button>

			<form onSubmit={handleFilter} className="custom-filter">
				<fieldset>
					<legend>Filter:</legend>
					<label>Property</label>
					<select name="property" onChange={handleCustomChange}>
						<option value="age" selected>
							Age
						</option>
						<option value="accountBalance">Balance</option>
						<option value="income">Income</option>
					</select>

					<select name="critaria" onChange={handleCustomChange}>
						{comparitions.map(qual => {
							return (
								<option value={qual.value} selected={qual.isDefault}>
									{qual.label}
								</option>
							);
						})}
					</select>
					<input name="propValue" onChange={handleCustomChange}></input>

					<input type="submit" value="submit"></input>
					<button onClick={handleReset}>Reset</button>
				</fieldset>
			</form>

			<table>
				<thead>
					<tr>
						{columns.map(col => (
							<th key={col.id}>{col.label}</th>
						))}
					</tr>
					<tr>
						{columns.map(col => (
							<th>
								{col.isSearchable && col.options && (
									<select onChange={event => handleChange(event, col)}>
										<option value={null}>{''}</option>
										{col.options.map(item => {
											return <option value={item}>{item}</option>;
										})}
									</select>
								)}
								{col.isSearchable && !col.options && (
									<input className="search-box" placeholder="Enter to search" onKeyPress={event => handleSubmit(event, col)} />
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{currentData &&
						currentData.map(item => (
							<tr key={item.CustomerID}>
								{columns.map(col => (
									<td key={item.CustomerID}>{item[col.key]}</td>
								))}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
