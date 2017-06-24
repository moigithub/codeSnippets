import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";


import SnippetDetail from './snippetDetail';
import SnippetList from './SnippetList';
import FilterForm from './FilterForm';
import FilterLanguage from './FilterLanguage';

import * as snippetsActions from '../actions/snippetsActions';


class Main extends React.Component {
 	/*
 	constructor(){
 		super();

 	//	this.setSnippetSelected = this.setSnippetSelected.bind(this);
 	//	this.addTag = this.addTag.bind(this);
 	//	this.removeTag = this.removeTag.bind(this);
 	//	this.setLanguage = this.setLanguage.bind(this);

 	}
*/
	state={
	
	}

	componentWillReceiveProps(nextProp){
		console.log("cwrp next",nextProp);
		console.log("cwrp this",this.props);

		var mySnippets = "";
		let queryParams = new URLSearchParams(nextProp.location.search);
		if(queryParams.has("user") ){
			mySnippets = queryParams.get("user").toLowerCase();
			console.log("mySnippets1", mySnippets);
		}
		console.log("mySnippets2", mySnippets);

		const id = nextProp.match.params.snippetId;
		if((id && !this.props.currentSelected)||(id && this.props.currentSelected._id !== id)){
			this.props.getSnippetById(id)
		} else if(
			(this.props.language !==nextProp.language)||
			([...this.props.filterTags,...nextProp.filterTags]
				.filter((n,i,a)=>a.indexOf(n)==a.lastIndexOf(n)).length>0)||
			(this.props.location.search !== nextProp.location.search)
			) {
console.log("mySnippets3", mySnippets);
			this.props.getSnippets(nextProp.filterTags, false, nextProp.language, mySnippets);			 
		}
	}


	static loadData=({store,match,query})=>{
		console.log("main.js loadData match",match);

		var mySnippets = "";
		//let queryParams = new URLSearchParams(this.props.location.search);
		console.log("node query param",query);
		if(query.user){
			mySnippets = query.user.toLowerCase();
		}

		if (match && match.params.snippetId) {
			return store.dispatch(snippetsActions.getSnippetByIdFromServer(match.params.snippetId));
		} else {
			return store.dispatch(snippetsActions.getSnippetsFromServer([], false, "", mySnippets));
		}
		
	}


	render(){
//		console.log("main render props",this.props);
		//console.log("actions",snippetsActions);
		const {match, location} = this.props;
//console.log("main state", this.state);
//console.log("main render", match.params)
console.log("render main.js locatoin",location);
		return (
		<div className="container">
			<div className="row">
				<div className="col-xs-12 col-sm-4 leftbar">
					<FilterForm />
					<FilterLanguage />
					<SnippetList snippetsList = {this.props.snippets} userFilter = {location.search}/>

				</div>


				<SnippetDetail {...this.props.currentSelected}/>
			</div>
		</div>		
		);
	}
}

function mapStateToProps(state){
	//console.log("mapStateToProps",state);
	return {
		snippets:state.snippets,
		currentSelected:state.currentSelected,
		language: state.languageFilter,
		filterTags: state.snippetTagFilter
	}
}

function mapDispatchToProps(dispatch, getState, ownProps){
	return {
		getSnippets: (tags,all,language, author)=>dispatch(snippetsActions.getSnippetsFromServer(tags,all,language, author)),
		getSnippetById: (id)=>dispatch(snippetsActions.getSnippetByIdFromServer(id))
	}


}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main))