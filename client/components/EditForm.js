import React from 'react';
import { connect } from 'react-redux'
import {withRouter} from "react-router-dom";


import BaseForm from './baseForm';

import {createSnippetAsync} from '../actions/snippetsActions';

function mapDispatchToProps(dispatch){
  return {
    saveSnippet : (snippet)=>dispatch(createSnippetAsync(snippet))
  }
}


let EditForm = withRouter(connect(
  
  state => ({
    initialValues: state.currentSelected // pull initial values from account reducer
  })/*,
  { load: loadAccount } // bind account loading action creator
  */
  , mapDispatchToProps
)(BaseForm));



const handleSubmit = (values,dispatch, props)=>{
  console.log("editForm: handleSubmit",values,dispatch,props);
  const snippetObj={
    "language":values.language,
    "title":values.title,
    "description":values.description,
    "code":values.code,
    "postedBy":values.postedBy,
    "tags":values.tags.split(","),
    "links":values.links
  };

};

const form = ()=>(<EditForm onSubmit={handleSubmit} title="Edit Snippet"/>);

export default form;