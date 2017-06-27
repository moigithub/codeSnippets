import React from 'react';
import { connect } from 'react-redux'
import {withRouter} from "react-router-dom";


import BaseForm from './baseForm';

import {createSnippetAsync, getSnippetByIdFromServer} from '../actions/snippetsActions';

class EditForm extends React.Component {

  componentDidMount(){
    console.log("editForm.js CDM",this.props);
    const id = this.props.match.params.snippetId;
    this.props.getSnippetById(id)
  }

  componentWillReceiveProps(nextProp){
    console.log("editForm.js cwrp next",nextProp);
//    console.log("cwrp this",this.props);

    var mySnippets = "";

    const id = nextProp.match.params.snippetId;
    if((id && !this.props.currentSelected)||(id && this.props.currentSelected._id !== id)){
      this.props.getSnippetById(id)
    }
  }


  static loadData=({store,match,query})=>{
    console.log("editForm.js loadData match",match);

    if (match && match.params.snippetId) {
      return store.dispatch(getSnippetByIdFromServer(match.params.snippetId));
    }
  }

  handleSubmit(values,dispatch, props){
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

    //saveSnippet(id)
    //o
    //dispatch(saveSnippet(snippetObj))
  };

  render(){
    return (
      <BaseForm onSubmit={this.handleSubmit} title="Edit Snippet"/>    
    );
  }

}




function mapDispatchToProps(dispatch){
  return {
    saveSnippet : (snippet)=>dispatch(createSnippetAsync(snippet)),
    getSnippetById: (id)=>dispatch(getSnippetByIdFromServer(id)),

  }
}


EditForm = withRouter(connect(
  
  state => ({
    initialValues: state.currentSelected, // pull initial values from account reducer
    currentSelected:state.currentSelected,
  })
  , mapDispatchToProps
)(EditForm));




export default EditForm;