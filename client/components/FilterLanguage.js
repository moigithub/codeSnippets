import React from 'react';
import {connect} from 'react-redux';
import {setLanguage} from '../actions/snippetsActions';

class FilterLanguage extends React.Component {

	constructor(){
		super();
	}

	render(){
		const {language, setLanguage} = this.props;
		return (
			<div className="form-group">
				<select 
					className="form-control" 
					value={language}
					onChange={(e)=>setLanguage(e.target.value)}>
					<option value="">No filter</option>
					<option value="Javascript">Javascript</option>
					<option value="Ruby">Ruby</option>
				</select>
			</div>
			);
	}
}

function mapStateToProps(state){
	return {
		language: state.languageFilter
	}
}

function mapDispatchToProps(dispatch){
	return {
		setLanguage: (language)=>dispatch(setLanguage(language))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterLanguage);