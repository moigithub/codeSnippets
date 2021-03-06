'use strict';

import React from 'react';
import {connect} from 'react-redux';

import TagList from './TagList';
import TagAndOrFilter from './TagAndOrFilter';

import {addTag, removeTag, setTagAndOrFilter} from '../actions/snippetsActions';

class FilterForm extends React.Component {

	constructor(){
		super();

		this.state={
			search:""
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e){
		e.preventDefault();
	//	console.log(this.textSearch);
		this.props.addTag(this.textSearch.value);
		this.textSearch.value="";
	};


	render(){
		const {removeTag, tagList} = this.props;
		return (
			<div className="filter">
				<form onSubmit={this.handleSubmit} id="searchForm">
  				    <div className="form-group">
					    <div className="input-group">
					      <input 
					      		type="text" 
					      		className="form-control" 
					      		onChange={()=>this.setState({search:this.textSearch.value})}
					      		placeholder="Search tag"
					      		ref={(input) => { this.textSearch = input; }} 
					      		/>
							<span className="input-group-btn">
							  	<button type="submit" className="btn btn-primary">
							  		<span className="glyphicon glyphicon-search"></span>
							  	</button>
							</span>
					    </div>
				    </div>
				</form>

				{tagList.length &&
					<TagAndOrFilter setTag={this.props.setTagAndOr} selectedOption={this.props.tagAndOr}/>
				}
				<TagList tagList={tagList} removeTag = {removeTag}/>
			</div>
		);
	}
}




function mapStateToProps(state){
	return {
		tagList: state.snippetTagFilter,
		tagAndOr: state.tagAndOrFilter
	}
}

function mapDispatchToProps(dispatch){
	return {
		addTag: (tag)=>dispatch(addTag(tag)),
		removeTag: (tag)=>dispatch(removeTag(tag)),
		setTagAndOr: (status)=>dispatch(setTagAndOrFilter(status))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterForm);
