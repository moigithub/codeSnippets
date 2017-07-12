'use strict';

import {
	ADDSNIPPETDATA, UPDATESNIPPETDATA, DELETESNIPPETDATA,
	GETSNIPPETDATA, SETSNIPPETDATA, SETCURRENTSNIPPETDATA,
	ADDTAG ,
	REMOVETAG, SETTAGANDOR,
	SETLANGUAGE, SETERROR
} from '../reducers/const'

import axios from 'axios';

import config from '../../config';

export const getAllSnippets = (data=[])=>(
{
	type: GETSNIPPETDATA,
	data : data
}
);

export const setAllSnippets = (data=[])=>(
{
	type: SETSNIPPETDATA,
	data : data
}
);

export const setCurrentSnippet = (snippet)=>(
{
	type: SETCURRENTSNIPPETDATA,
	data : snippet
}
);

export const createSnippet = (snippet)=>(
{
	type: ADDSNIPPETDATA,
	data : snippet
}
);

export const updateSnippet = (snippet)=>(
{
	type: UPDATESNIPPETDATA,
	data : snippet
}
);

export const deleteSnippet = (snippet)=>(
{
	type: DELETESNIPPETDATA,
	data : snippet
}
);


export const setLanguage = (language)=>({type:SETLANGUAGE ,data:language});
export const setError = (error)=>({type:SETERROR ,data:error});
export const addTag = (tag)=>({type:ADDTAG ,data:tag});
export const removeTag = (tag)=>({type:REMOVETAG ,data:tag});
export const setTagAndOrFilter = (value)=>({type:SETTAGANDOR, data:value});

///////////////////////////////////////////////////////////////////////////////
/// async actions
///////////////////////////////////////////////////////////////////////////////

// to request data to server from client
// send a POST request with application/json as content-type
// {"query":"{Users{_id,email,displayName}}"}
//{"query":"{CodeSnippets{_id,language,title,description,code,tags,links,author{email,displayName}}}","variables":null,"operationName":null}
//using axios response on response.data.data.Users


//{"query":"query findSnippets($tags:[String], $all:Boolean){CodeSnippets(tags:$tags,all:$all){_id,language,title,description,code,tags,links,author{email,displayName}}}",
//"variables":{"tags":["react","react router 4"],"all":true},"operationName":"findSnippets"}

//export const API_URL = config.host+':'+config.port+'/graphql';
export const API_URL = '/graphql';
//console.log("apiurl", API_URL);

const options = { headers: {'Content-Type': 'application/json'}};

export const getSnippetsFromServer=(tags=[],all=false,language="", author="")=> {
//    console.log("getSnippetsFromServer", tags, all,language,"autor:",author);
    const query = `query findSnippets($tags:[String], $all:Boolean, $language:String, $author:ID){
			CodeSnippets(tags:$tags,all:$all,language:$language,author:$author){
				_id,language,title,description,code,tags,links,author{email,name}
			}
		}`;
	let queryJSON = 
	{
		"query":query,
		"variables":{
			"tags":tags,
			"all": all,
			"language": language,
			"author": author
		},
		"operationName":"findSnippets"
	};


    return function(dispatch, getState){
		
		if(getState().errors.length){
			dispatch(setError([]));
		}

    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
		    //console.log("snipetaction:: ",response.data.data);
		    if(response.data.errors && response.data.errors.length){
		    	return dispatch(setError(response.data.errors));
		    }


		    dispatch(setAllSnippets(response.data.data.CodeSnippets||[]));
		  })
		  .catch(function (error) {
	//	    console.error("getSnippetsFromServer Error",error);
		    return new Error("Couldnt get data from server.")
		  });
    }
}



export const getSnippetByIdFromServer=(snippetId)=> {
//    console.log("getSnippetsFromServer", tags, all);
    const query = `query findSnippet($Id:String!){
			CodeSnippet(snippetId:$Id){
				_id,language,title,description,code,tags,links,isOwner,author{_id,email,name}
			}
		}`;
	let queryJSON = 
	{
		"query":query,
		"variables":{
			"Id":snippetId
		},
		"operationName":"findSnippet"
	};



    //console.log("getSnippetByIdFromServer",snippetId);
    return function(dispatch, getState){

		if(getState().errors.length){
			console.log("1");
			dispatch(setError([]));
		}
		
    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
	//	    console.log("current snippet by id",response.data);
		    if(response.data.errors && response.data.errors.length){
		    	console.log("2");
		    	return dispatch(setError(response.data.errors));
		    	//return new Error("Couldnt get data from server.")

		    }

		    dispatch(setCurrentSnippet(response.data.data.CodeSnippet));
		  })
		  .catch(function (error) {
	//	    console.error("getSnippetByIdFromServer Error",error);
		    return new Error("Couldnt get data from server.")
		  });
    }
}

export const createSnippetAsync=({language="", title="", description="", code="", postedBy="", tags=[], links=[]})=> {
//    console.log("getSnippetsFromServer", tags, all);
    const query = `mutation add($s:SnippetInput!){
    	createSnippet(snippet:$s){_id,language,title,description,code,tags,links,isOwner,author{email,name}}
    }`;
	let queryJSON = 
	{
		"query":query,
		"variables":{
			"s":{
				"language":language,
				"title":title,
				"description":description,
				"code":code,
				"postedBy":postedBy,
				"tags":tags,
				"links":links
			}
		},
		"operationName":"add"
	};

   // console.log("getSnippetByIdFromServer");
    return function(dispatch, getState){
		if(getState().errors.length){
			dispatch(setError([]));
		}

    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
	//	    console.log("create snippet",response.data);
		    if(response.data.errors && response.data.errors.length){
		    	return dispatch(setError(response.data.errors));
		    }


		    dispatch(createSnippet(response.data.data.createSnippet));
		  })
		  .catch(function (error) {
	//	    console.error("createSnippetAsync Error",error);
		    return new Error("Couldnt get data from server.")
		  });
    }
}


export const updateSnippetAsync=(id="",{language="", title="", description="", code="", postedBy="", tags=[], links=[]})=> {
//    console.log("getSnippetsFromServer", tags, all);
//console.log("updateSnippetAsync", links);
    const query = `mutation update($id:ID!,$s:SnippetInput!){
    	updateSnippet(snippetId:$id, snippet:$s){_id,language,title,description,code,tags,links,isOwner,author{email,name}}
    }`;


	let queryJSON = 
	{
		"query":query,
		"variables":{
			"id":id,
			"s":{
				"language":language,
				"title":title,
				"description":description,
				"code":code,
				"postedBy":postedBy,
				"tags":tags,
				"links":links
			}
		},
		"operationName":"update"
	};

   // console.log("getSnippetByIdFromServer");
    return function(dispatch, getState){
		if(getState().errors.length){
			dispatch(setError([]));
		}
	
    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
	//	    console.log("update snippet",response.data);
		    if(response.data.errors && response.data.errors.length){
		    	return dispatch(setError(response.data.errors));
		    }

		    dispatch(setCurrentSnippet(response.data.data.updateSnippet));
		    dispatch(updateSnippet(response.data.data.updateSnippet));
		  })
		  .catch(function (error) {
	//	    console.error("updateSnippetAsync Error",error);
		    return new Error("Couldnt get data from server.")
		  });
    }
}


export const deleteSnippetById=(snippetId="")=> {
//    console.log("getSnippetsFromServer", tags, all);
    const query = `mutation delete($id:ID!){
    	deleteSnippet(snippetId:$id){_id,title}
    }`;
	let queryJSON = 
	{
		"query":query,
		"variables":{
			"id":snippetId
		},
		"operationName":"delete"
	};

    //console.log("async action deleteSnippetById", snippetId);


    return function(dispatch, getState){
		if(getState().errors.length){
			dispatch(setError([]));
		}

    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
		    //console.log("delete snippet",response.data);
		    if(response.data.errors && response.data.errors.length){
		    	return dispatch(setError(response.data.errors));
		    }

            ///NO return cause bad behavior when error
		    dispatch(deleteSnippet(response.data.data.deleteSnippet._id));
		    dispatch(setCurrentSnippet({})); 
		    
		  })
		  .catch(function (error) {
	//	    console.error("deleteSnippetById Error",error);
		    return new Error("Couldnt get data from server.")
		  });
    }
}

