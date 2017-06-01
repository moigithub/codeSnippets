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
			<form className="form-inline">
			  <div className="form-group row">
				  <div className="col-xs-12">
				    <div className="input-group">
				      <input type="text" className="form-control" id="searchInput" placeholder="Search tag"/>
					  <span	 className="input-group-btn">
					  	<button type="submit" className="btn btn-primary">
					  		<span className="glyphicon glyphicon-search"></span>
					  	</button>
					  </span>
				    </div>
				  </div>
			  </div>
			</form>


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
