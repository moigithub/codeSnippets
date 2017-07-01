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

	getUserParam = (props)=>{
		let queryParams = new URLSearchParams(props.location.search);
		if(queryParams.has("user") ){
			return queryParams.get("user").toLowerCase();
		}
		return "";
	}

	componentDidMount(){
		console.log("main.js CDM",this.props);
		var mySnippets = this.getUserParam(this.props);
		this.props.getSnippets(this.props.filterTags, false, this.props.language, mySnippets);

		const id = this.props.match.params.snippetId;
		if (id ) {
			console.log("didmount getting data for next id",id);
			this.props.getSnippetById(id);
		}		
	}
/*
	componentWillMount(){
		console.log("compWillMount", this.props.currentSelected, this.props.match);
		const id = this.props.match.params.snippetId;
		if((id && !this.props.currentSelected)||(id && this.props.currentSelected._id !== id)){
			console.log("willmount is diff!!");
			console.log("willmount getting data for next id",id);
			this.props.getSnippetById(id);
			
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		console.log("shuld component update", this.props.errors);
		//return true;
		return !this.props.errors.length;
	}
*/
	componentWillReceiveProps(nextProp){
		console.log("cwrp next",nextProp);
		console.log("cwrp this",this.props);

		var mySnippets = this.getUserParam(nextProp);

		//console.log("main.js loca",this.props.location.search,"\nnext:",nextProp.location.search)

		// if no errors
//		if(!this.props.errors.length) {

			const id = nextProp.match.params.snippetId;
			console.log("next id",id,"\ncurSelected id", this.props.match.params.snippetId);

			if (id && id !== this.props.match.params.snippetId) {
				console.log("is diff!!");
					console.log("getting data for next id",id);
					this.props.getSnippetById(id);
			} else if(
				(this.props.language !==nextProp.language)||
				([...this.props.filterTags,...nextProp.filterTags]
					.filter((n,i,a)=>a.indexOf(n)==a.lastIndexOf(n)).length>0)||
				(this.props.location.search !== nextProp.location.search)
				) {
	console.log("main.js CWRP elseif getSnippets");
				this.props.getSnippets(nextProp.filterTags, false, nextProp.language, mySnippets);			 
			}
/*			
		} else {
			this.props.clearErrors();
		}
*/		
	}


	static loadData=({store,match,query})=>{
		console.log("main.js loadData match",match,"\nquery",query);

		var mySnippets = "";
		//let queryParams = new URLSearchParams(this.props.location.search);
		//console.log("node query param",query);
		if(query.user){
			mySnippets = query.user.toLowerCase();
		}

		if (match && match.params.snippetId) {
			let result= store.dispatch(snippetsActions.getSnippetByIdFromServer(match.params.snippetId));
			console.log("main.js loaddata,\n\ndispatch result", result);
		} else {
//			console.log("loadData mySnippets",mySnippets);
			return store.dispatch(snippetsActions.getSnippetsFromServer([], false, "", mySnippets));
		}
		
	}


	render(){
		console.log("main render props",this.props);
		//console.log("actions",snippetsActions);
		const {match, location} = this.props;
//console.log("main state", this.state);
//console.log("main render", match.params)
//console.log("render main.js locatoin",location);
//console.log("main.js render currentSelected", this.props);

		const showDetails = ()=>{
			if(!this.props.currentSelected || Object.keys(this.props.currentSelected).length<1){
				return <div className="col-xs-12 col-sm-8">Select a code snippet</div>
			}else {
				return <SnippetDetail {...this.props.currentSelected} 
							deleteSnippet={this.props.deleteSnippet}
							/>
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
				<div className="col-xs-12 col-sm-8">
				{this.props.errors.map((error,i) => <div className="alert alert-danger" key={`error${i}`} role="alert">{JSON.stringify(error.message)}</div>)}
				</div>
				{ showDetails() }
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
		filterTags: state.snippetTagFilter,
		errors : state.errors
	}
}

function mapDispatchToProps(dispatch, getState, ownProps){
	return {
		getSnippets: (tags,all,language, author)=>dispatch(snippetsActions.getSnippetsFromServer(tags,all,language, author)),
		getSnippetById: (id)=>dispatch(snippetsActions.getSnippetByIdFromServer(id)),
		deleteSnippet: (id)=>dispatch(snippetsActions.deleteSnippetById(id)),
		clearErrors: ()=>dispatch(snippetsActions.setError([]))
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main))