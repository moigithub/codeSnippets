import React from 'react';
import {connect} from 'react-redux';

import SnippetDetail from './snippetDetail';
import SnippetList from './SnippetList';
import FilterForm from './FilterForm';

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
	render(){
		console.log("main render props",this.props);
		console.log("actions",snippetsActions);
		this.props.getSnippetsFromServer(); //test

		return (
		<div className="container">
			<div className="row">
				<div className="col-xs-12 col-sm-4 leftbar">
					<FilterForm />
					<SnippetList snippetsList = {sl}/>

				</div>


				<SnippetDetail {...detail}/>
			</div>
		</div>		);
	}
}

function mapStateToProps(state){
	console.log("mapStateToProps",arguments);
	return {
		snippets:state.snippet
	}
}

export default connect(mapStateToProps,snippetsActions)(Main)