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
	
	}

	componentWillReceiveProps(nextProp){
		console.log("cwrp next",nextProp);
		console.log("cwrp this",this.props);
		
		if(nextProp.match.path==="/MySnippets"){
			this.props.showMySnippets(true);
		} else {
			this.props.showMySnippets(false);
		}

		const id = nextProp.match.params.snippetId;
		if((id && !this.props.currentSelected)||(id && this.props.currentSelected._id !== id)){
			this.props.getSnippetById(id)
		} else if(
			(this.props.language !==nextProp.language)||
			([...this.props.filterTags,...nextProp.filterTags]
				.filter((n,i,a)=>a.indexOf(n)==a.lastIndexOf(n)).length>0)
			) {
			this.props.getSnippets(nextProp.filterTags, false, nextProp.language);			 
		}
	}


	static loadData=({store,match})=>{
		console.log("main.js loadData match",match);
		
		if (match && match.params.snippetId) {
			return store.dispatch(snippetsActions.getSnippetByIdFromServer(match.params.snippetId));
		} else {
			return store.dispatch(snippetsActions.getSnippetsFromServer([], false, ""));
		}
		
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
					<FilterForm />
					<FilterLanguage />
					<SnippetList snippetsList = {this.props.snippets} />

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
		filterTags: state.snippetTagFilter,
		mySnippets: state.mySnippets
	}
}

function mapDispatchToProps(dispatch, getState, ownProps){
	return {
		getSnippets: (tags,all,language)=>dispatch(snippetsActions.getSnippetsFromServer(tags,all,language)),
		getSnippetById: (id)=>dispatch(snippetsActions.getSnippetByIdFromServer(id)),
		showMySnippets: (status)=>dispatch(snippetsActions.mySnippets(status))
	}


}

export default connect(mapStateToProps,mapDispatchToProps)(Main)