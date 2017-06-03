import React from 'react';
import {connect} from 'react-redux';

import SnippetDetail from './snippetDetail';
import SnippetList from './SnippetList';
import FilterForm from './FilterForm';
import FilterLanguage from './FilterLanguage';

import * as snippetsActions from '../actions/snippetsActions';

const sl = [
	{id:1, 
		language: 'js', 
		title: 'some title', 
		description: 'some desc', 
		postedBy: 'jojolete', 
		code:'1',
		links:['url1']},
	{id:2, 
		language: 'js', title: 'mongoose connect & err handler', 
		description: 'some desc', 
		postedBy: 'jojolete', 
		code:'1',
		links:['url1']},
	{id:3, 
		language: 'js', title: 'react router 4', 
		description: 'some desc', 
		postedBy: 'jojolete', 
		code:'1',
		links:['url1']},
	{id:4, 
		language: 'rb', title: 'asdf yttry', 
		description: 'some desc', 
		postedBy: 'jojolete', 
		code:'1',
		links:['url1']},
	{id:5, 
		language: 'vb', title: 'form asdf', 
		description: 'some desc', 
		postedBy: 'jojolete', 
		code:'1',
		links:['url1']},
	{id:6, 
		language: 'php', title: 'fetch data', 
		description: 'some desc', 
		postedBy: 'jojolete', 
		code:'1',
		links:['url1']}
];


const detail = sl[0];

 class Main extends React.Component {
 	constructor(){
 		super();

 		this.setSnippetSelected = this.setSnippetSelected.bind(this);
 		this.addTag = this.addTag.bind(this);
 		this.removeTag = this.removeTag.bind(this);
 		this.setLanguage = this.setLanguage.bind(this);

 		this.state={
 			currentSelected : null,
 			filterTags:[],
 			language:""
 		}
 	}

 	componentDidMount(){

 		console.log("didmount", this.props);
 		this.setState({currentSelected: this.props.snippets[0]});
 	}

 	setSnippetSelected(snippet){
 		//console.log("setSnippetSelected", snippet);
 		this.setState({currentSelected: snippet});
 	}

 	addTag(tag){
 		var allTags = this.state.filterTags.slice();
 		allTags.push(tag);
 		this.setState({filterTags: allTags});
 	//	console.log(allTags)
 		this.props.getSnippets(allTags, false)
 	}

 	removeTag(tag){
 		var allTags = this.state.filterTags.filter(t=>t!==tag);
 		this.setState({filterTags: allTags});
 		this.props.getSnippets(allTags, false)
 	}

 	setLanguage(language){
 		this.setState({language: language});
 		this.props.getSnippets(this.state.filterTags, false, language);
 	}

	render(){
	//	console.log("main render props",this.props);
		//console.log("actions",snippetsActions);
console.log("main state", this.state);
		return (
		<div className="container">
			<div className="row">
				<div className="col-xs-12 col-sm-4 leftbar">
					<FilterForm addTag = {this.addTag} removeTag = {this.removeTag} tagList = {this.state.filterTags} />
					<FilterLanguage value={this.state.language} setLanguage={this.setLanguage} />
					<SnippetList snippetsList = {this.props.snippets} setSnippetSelected={this.setSnippetSelected} />

				</div>


				<SnippetDetail {...this.state.currentSelected}/>
			</div>
		</div>		);
	}
}

function mapStateToProps(state){
	//console.log("mapStateToProps",state);
	return {
		snippets:state.snippets
	}
}

function mapDispatchToProps(dispatch, oo){
	return {
		getSnippets: (tags,all,language)=>dispatch(snippetsActions.getSnippetsFromServer(tags,all,language))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Main)