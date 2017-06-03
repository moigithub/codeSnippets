import React from 'react';
import TagList from './TagList';


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
		const {addTag, removeTag, tagList} = this.props;
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

				<TagList tagList={tagList} removeTag = {removeTag}/>
			</div>
		);
	}
}

export default FilterForm;
