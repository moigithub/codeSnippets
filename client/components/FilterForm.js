import React from 'react';
import TagList from './TagList';

const tl = [
	{title: 'REACT'},
	{title: 'MONGO'},
	{title: 'MONGOOSE'},
	{title: 'EXPRESS'}
];


const FilterForm = ()=>{
	return (
		<div className="filter">
			<div className="form-group">
			    <input type="text" className="form-control" id="searchInput" placeholder="Search text"/>
		    </div>
			<div className="form-group">
				<select name="" id="" value="All"  className="form-control">
					<option value="">No filter</option>
					<option value="Javascript">Javascript</option>
					<option value="Ruby">Ruby</option>
				</select>
			</div>
			<TagList tags={tl}/>
		</div>
	);
}

export default FilterForm;