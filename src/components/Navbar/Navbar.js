import React from 'react';
import {NavLink} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
	return (
		<nav>
			<ul>
				<li>
					<NavLink to="/">Table</NavLink>
				</li>
				<li>
					<NavLink to="/bar">Bar</NavLink>
				</li>
				<li>
					<NavLink to="/scatter">Scatter</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
