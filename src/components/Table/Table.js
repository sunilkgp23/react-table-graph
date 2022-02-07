import {useEffect, useState} from 'react';
import './Table.css';

const Table = props => {
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const [currentData, SetCurrentData] = useState([]);
	const [filters, setFilters] = useState({});
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
	return (
		<div className="table-container">
			<button disabled={page === 1} onClick={decreasePage}>
				Previous
			</button>
			{page}
			<button disabled={!hasMore} onClick={IncreasePage}>
				Next
			</button>

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
								{col.isSearchable && <input className="search-box" placeholder="Enter to search" onKeyPress={event => handleSubmit(event, col)} />}
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
