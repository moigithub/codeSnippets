import React from 'react';

class FilterLanguage extends React.Component {

	constructor(){
		super();

		this.handleLanguageFilter= this.handleLanguageFilter.bind(this);
	}


	handleLanguageFilter(e){
	//	console.log("languagefilter select", e.target.value);
		this.props.setLanguage(e.target.value);
	}

	render(){
		return (
			<div className="form-group">
				<select name="" id="" 
					className="form-control" 
					value={this.props.language}
					onChange={this.handleLanguageFilter}>
					<option value="">No filter</option>
					<option value="Javascript">Javascript</option>
					<option value="Ruby">Ruby</option>
				</select>
			</div>
			);
	}
}

export default FilterLanguage;