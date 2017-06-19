import React from 'react';
import {connect} from 'react-redux';


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
		filterTags:[],
		language:""
	}

	componentWillReceiveProps(nextProp){
		console.log("cwrp",nextProp);
		console.log("cwrp this",this.props);
		const id = nextProp.match.params.snippetId;
		if(id && this.props.currentSelected._id !== id){
			this.props.getSnippetById(id)
		}
	}

 	addTag=(tag)=>{
 		var allTags = this.state.filterTags.slice();
 		allTags.push(tag);
 		this.setState({filterTags: allTags});
 	//	console.log(allTags)
 		this.props.getSnippets(allTags, false)
 	}

 	removeTag=(tag)=>{
 		var allTags = this.state.filterTags.filter(t=>t!==tag);
 		this.setState({filterTags: allTags});
 		this.props.getSnippets(allTags, false)
 	}

 	setLanguage=(language)=>{
 		this.setState({language: language});
 		this.props.getSnippets(this.state.filterTags, false, language);
 	}

	render(){
//		console.log("main render props",this.props);
		//console.log("actions",snippetsActions);
		const {match, location} = this.props;
//console.log("main state", this.state);
//console.log("main render", match.params)
		return (
		<div className="container">
			<div className="row">
				<div className="col-xs-12 col-sm-4 leftbar">
					<FilterForm addTag = {this.addTag} removeTag = {this.removeTag} tagList = {this.state.filterTags} />
					<FilterLanguage value={this.state.language} setLanguage={this.setLanguage} />
					<SnippetList snippetsList = {this.props.snippets} getSnippetById={this.props.getSnippetById} />

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
		currentSelected:state.currentSelected
	}
}

function mapDispatchToProps(dispatch, oo){
	return {
		getSnippets: (tags,all,language)=>dispatch(snippetsActions.getSnippetsFromServer(tags,all,language)),
		getSnippetById: (id)=>{
	//		console.log("getSnippetById Main.js", id);
			return dispatch(snippetsActions.getSnippetByIdFromServer(id))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Main)