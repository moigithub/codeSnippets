'use strict';

import React from 'react';
import { connect } from 'react-redux'
import {withRouter} from "react-router-dom";


import BaseForm from './baseForm';

import {updateSnippetAsync, getSnippetByIdFromServer, API_URL} from '../actions/snippetsActions';

class EditForm extends React.Component {

  componentDidMount(){
  //  console.log("editForm.js CDM",this.props);
    const id = this.props.match.params.snippetId;
    this.props.getSnippetById(id)
  }

  componentWillReceiveProps(nextProp){
    console.log("editForm.js cwrp next",nextProp);
//    console.log("cwrp this",this.props);

    var mySnippets = "";

    const id = nextProp.match.params.snippetId;
    if(   (id && !this.props.initialValues)
        ||(id && this.props.initialValues._id !== id)){
      this.props.getSnippetById(id)
    }
  }


  static loadData=({store,match,query})=>{
  //  console.log("editForm.js loadData match",match);

    if (match && match.params.snippetId) {
      return store.dispatch(getSnippetByIdFromServer(match.params.snippetId));
    }
  }

  handleSubmit=(values,dispatch, props)=>{
  //  console.log("editForm: handleSubmit",values,dispatch,props);
    const snippetObj={
      "language":values.language,
      "title":values.title,
      "description":values.description,
      "code":values.code,
      "postedBy":values.postedBy,
      "tags":typeof(values.tags)==="string" ? values.tags.split(","): values.tags,
      "links":values.links
    };

    //saveSnippet(id)
    //o
    props.saveSnippet(values._id,snippetObj);
    props.history.push('/snippets');
  };

  render(){
    return (
      <BaseForm {...this.props} onSubmit={this.handleSubmit} title="Edit Snippet" apiURL = {API_URL} method="POST"/>    
    );
  }

}


function mapDispatchToProps(dispatch){
  return {
    saveSnippet : (id,snippet)=>dispatch(updateSnippetAsync(id,snippet)),
    getSnippetById: (id)=>dispatch(getSnippetByIdFromServer(id)),

  }
}

function mapStateToProps(state){
  return {
    initialValues: state.currentSelected // pull initial values from account reducer
  }
}

EditForm = withRouter(connect( mapStateToProps, mapDispatchToProps )(EditForm));


export default EditForm;