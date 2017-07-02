import {
  ADDSNIPPETDATA, GETSNIPPETDATA, 
  SETSNIPPETDATA, UPDATESNIPPETDATA, DELETESNIPPETDATA,
  SETCURRENTSNIPPETDATA,
  ADDTAG, REMOVETAG,
  SETLANGUAGE,SETERROR
} from '../reducers/const'

export const snippetReducer = (state = [], action) => {
	console.log("snipet reducer", state, action);
  switch (action.type) {
    case SETSNIPPETDATA:
      return action.data;
    case ADDSNIPPETDATA:
      return [...state, action.data];
    case UPDATESNIPPETDATA:
      let index = state.findIndex(snippet => snippet._id == action.data._id); //action.data es snippet object
      return [...state.slice(0,index-1), action.data, ...state.slice(index+1)];
    case DELETESNIPPETDATA:  
      return state.filter(snippet => snippet._id !== action.data);  //action.data es _id
    case GETSNIPPETDATA:
    default:
      return state;
  }
}

export const snippetTagFilterReducer = (state=[], action)=>{
  switch(action.type){
    case ADDTAG:
      return [...state.filter(tag=>tag!==action.data), action.data];
    case REMOVETAG:
      return state.filter(tag => tag !== action.data)  //action.data es tag 
    default:
      return state;
  }
}

export const languageFilterReducer = (state = "", action)=>{
  switch(action.type){
    case SETLANGUAGE:
      return action.data;
    default:
      return state;
  }
}

export const errorsReducer = (state = [], action)=>{
  switch(action.type){
    case SETERROR:
      return action.data;
    default:
      return state;
  }
}

export const currentSnippetReducer = (state={}, action)=>{
	switch(action.type){
	    case SETCURRENTSNIPPETDATA:
    		return action.data;
    	default:
    		return state;
	}
}