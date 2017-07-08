'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import queryString from 'query-string';

import SnippetDetail from './snippetDetail';
import SnippetList from './SnippetList';
import FilterForm from './FilterForm';
import FilterLanguage from './FilterLanguage';

import * as snippetsActions from '../actions/snippetsActions';


class Main extends React.Component {
 /*	
 	constructor(){
 		super();
// 		console.log("main.js constructor", this.props);

 	//	this.setSnippetSelected = this.setSnippetSelected.bind(this);
 	//	this.addTag = this.addTag.bind(this);
 	//	this.removeTag = this.removeTag.bind(this);
 	//	this.setLanguage = this.setLanguage.bind(this);

 	}
*/

	state={	}

	static loadData=({store,match,query})=>{
	//	console.log("main.js loadData match",match,"\nquery",query);
		var promises=[];
		var mySnippets = "";
		if(query.user){
			mySnippets = query.user.toLowerCase();
		}
//		console.log("loadData mySnippets",mySnippets);
		var p1=store.dispatch(snippetsActions.getSnippetsFromServer([], false, "", mySnippets));


		if (match && match.params.snippetId) {
			var p2= store.dispatch(snippetsActions.getSnippetByIdFromServer(match.params.snippetId));
		//	console.log("main.js loaddata,\n\ndispatch result", p2);
		} 

		return Promise.all([p1,p2]);
	}

	getUserParam = (location)=>{
		//let queryParams = new URLSearchParams(props.location.search);
		const queryParams = queryString.parse(location.search);
		//if(queryParams.has("user") ){
		if(queryParams.user){
			return queryParams.user.toLowerCase();
		}
		return "";
	}

	componentDidMount(){

	//	console.log("main.js CDM");
		Main.loadData({
			store:this.context.store,
			match:this.props.match, 
			query:queryString.parse(this.props.location.search)
		});
		/*
		var mySnippets = this.getUserParam(this.props.location);
		this.props.getSnippets(this.props.filterTags, false, this.props.language, mySnippets);

		const id = this.props.match.params.snippetId;
		if (id ) {
			console.log("didmount getting data for next id",id);
			this.props.getSnippetById(id);
		}
		*/
	}

	componentWillReceiveProps(nextProp){
		//console.log("cwrp next",nextProp);
		//console.log("main.js cwrp",this.props);

		var mySnippets = this.getUserParam(nextProp.location);

		//console.log("main.js loca",this.props.location.search,"\nnext:",nextProp.location.search)

		const id = nextProp.match.params.snippetId;
//			console.log("next id",id,"\ncurSelected id", this.props.match.params.snippetId);

		if (id && id !== this.props.match.params.snippetId) {
//				console.log("is diff!!");
//				console.log("getting data for next id",id);
				this.props.getSnippetById(id);
		} else if(
			(this.props.language !==nextProp.language)||
			([...this.props.filterTags,...nextProp.filterTags]
				.filter((n,i,a)=>a.indexOf(n)==a.lastIndexOf(n)).length>0)||
			(this.props.location.search !== nextProp.location.search)||
			(this.props.location.pathname !== nextProp.location.pathname)
			) {
//console.log("main.js CWRP elseif getSnippets");
			this.props.getSnippets(nextProp.filterTags, false, nextProp.language, mySnippets);			 
		}
	}

	deleteSnippet = (snippetId)=>{
		//console.log("main.js delete snippets props", this.props);
		this.props.deleteSnippet(snippetId);
		this.props.history.push('/snippets'+this.props.location.search);
	}

	render(){
		//console.log("main render props", this.props);
		//console.log("actions",snippetsActions);
		const {match, location} = this.props;
//console.log("main state", this.state);
//console.log("main render", match.params)
//console.log("render main.js locatoin",location);
//console.log("main.js render currentSelected", this.props);
		const showErrors = ()=>{
			if(this.props.errors.length>0){
				return (<div className="col-xs-12 col-sm-8">
					{this.props.errors.map((error,i) => (
						<div className="alert alert-danger" 
							 key={`error${i}`} 
							 role="alert">
							 {error.message}
							 </div>
						)
					)}
				</div>);
			} else {
				return null;
			}
		}

		const showDetails = ()=>{
		//	console.log("shwdetails main.js props", this.props);
			if(this.props.currentSelected && this.props.currentSelected._id){
				return <SnippetDetail {...this.props.currentSelected} 
							deleteSnippet={(id)=>this.deleteSnippet(id)}
							/>
			}else {
				return <div className="col-xs-12 col-sm-8">Select a code snippet</div>
			}
		}

		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-sm-4 leftbar">
						<FilterForm />
						<FilterLanguage />
						<SnippetList snippetsList = {this.props.snippets} userFilter = {location.search}/>
					</div>
					{ showErrors() }
					{ showDetails() }
				</div>
			</div>		
		);
	}
}

Main.contextTypes = { store: PropTypes.object };

function mapStateToProps(state){
	//console.log("mapStateToProps",state);
	return {
		snippets:state.snippets,
		currentSelected:state.currentSelected,
		language: state.languageFilter,
		filterTags: state.snippetTagFilter,
		errors : state.errors
	}
}

function mapDispatchToProps(dispatch, getState, ownProps){
	return {
		getSnippets: (tags,all,language, author)=>dispatch(snippetsActions.getSnippetsFromServer(tags,all,language, author)),
		getSnippetById: (id)=>dispatch(snippetsActions.getSnippetByIdFromServer(id)),
		deleteSnippet: (id)=>dispatch(snippetsActions.deleteSnippetById(id))
	//	clearErrors: ()=>dispatch(snippetsActions.setError([]))
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main))