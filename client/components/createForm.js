'use strict';

import React from 'react';
import { connect } from 'react-redux'
import {withRouter} from "react-router-dom";


import BaseForm from './baseForm';

import {createSnippetAsync, API_URL} from '../actions/snippetsActions';

function mapDispatchToProps(dispatch){
  return {
    createSnippet : (snippet)=>dispatch(createSnippetAsync(snippet))
  }
}


let CreateSnippetForm = withRouter(connect(
  /*
  state => ({
    initialValues: state.account.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
  */
  null, mapDispatchToProps
)(BaseForm));



const handleSubmit = (values,dispatch, props)=>{
//  console.log("createForm: handleSubmit",values,dispatch,props);
  const snippetObj={
    "language":values.language,
    "title":values.title,
    "description":values.description,
    "code":values.code,
    "postedBy":values.postedBy,
    "tags":values.tags.split(","),
    "links":values.links
  };
  var x=props.createSnippet(snippetObj);
  console.log("handleSubmit x",x);
  props.history.push('/snippets');
};

const form = ()=>(<CreateSnippetForm onSubmit={handleSubmit} title="New Snippet" apiURL={API_URL}/>);

export default form
