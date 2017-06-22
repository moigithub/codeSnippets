import {
	ADDSNIPPETDATA, GETSNIPPETDATA, SETSNIPPETDATA, SETCURRENTSNIPPETDATA,
	ADDTAG ,
	REMOVETAG,
	MYSNIPPETS,
	ALLSNIPPETS,
	SETLANGUAGE 
} from '../reducers/const'

import axios from 'axios';

import config from '../../config';

export const getAllSnippets = (data)=>(
{
	type: GETSNIPPETDATA,
	data : data
}
);

export const setAllSnippets = (data)=>(
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


export const setLanguage = (language)=>({type:SETLANGUAGE ,data:language});
export const addTag = (tag)=>({type:ADDTAG ,data:tag});
export const removeTag = (tag)=>({type:REMOVETAG ,data:tag});


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

const API_URL = config.host+':'+config.port+'/graphql';
//console.log("apiurl", API_URL);

const options = { headers: {'Content-Type': 'application/json'}};

export const getSnippetsFromServer=(tags=[],all=false,language="")=> {
//    console.log("getSnippetsFromServer", tags, all);
    const query = `query findSnippets($tags:[String], $all:Boolean, $language:String){
			CodeSnippets(tags:$tags,all:$all,language:$language){
				_id,language,title,description,code,tags,links,author{email,name}
			}
		}`;
	let queryJSON = 
	{
		"query":query,
		"variables":{
			"tags":tags,
			"all": all,
			"language": language
		},
		"operationName":"findSnippets"
	};

    return function(dispatch, getState){
    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
	//	    console.log(response.data.data.CodeSnippets);

		    dispatch(setAllSnippets(response.data.data.CodeSnippets));
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
    }
}



export const getSnippetByIdFromServer=(snippetId)=> {
//    console.log("getSnippetsFromServer", tags, all);
    const query = `query findSnippet($Id:String!){
			CodeSnippet(snippetId:$Id){
				_id,language,title,description,code,tags,links,author{email,name}
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


   // console.log("getSnippetByIdFromServer");
    return function(dispatch, getState){
    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
	//	    console.log("current snippet by id",response.data);

		    dispatch(setCurrentSnippet(response.data.data.CodeSnippet));
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
    }
}

export const createSnippetAsync=({language="", title="", description="", code="", postedBy="", tags=[], links=[]})=> {
//    console.log("getSnippetsFromServer", tags, all);
    const query = `mutation add($s:SnippetInput!){
    	createSnippet(snippet:$s){_id,language,title,description,code,tags,links,author{email,name}}
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
    	return axios.post(API_URL, queryJSON)
    	  .then(function (response) {
		    console.log("create snippet",response.data);

		    dispatch(createSnippet(response.data.data.createSnippet));
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
    }
}