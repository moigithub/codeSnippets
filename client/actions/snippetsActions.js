import {SNIPPETDATA} from '../reducers/const'

import axios from 'axios';


export const getAllSnippets = (data)=>(
{
	type: SNIPPETDATA,
	data : data
}

);



///////////////////////////////////////////////////////////////////////////////
/// async actions
///////////////////////////////////////////////////////////////////////////////

// to request data to server from client
// send a POST request with application/json as content-type
// {"query":"{Users{_id,email,displayName}}"}


const API_URL = '/graphql';
const options = { headers: {'Content-Type': 'application/json'}};

export const getSnippetsFromServer=()=> {
    //console.log("getImagesFromServer");
    return function(dispatch){
    	axios.post(API_URL, {"query":"{Users{_id,email,displayName}}"})
    	  .then(function (response) {
		    console.log(response);
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
    }
}