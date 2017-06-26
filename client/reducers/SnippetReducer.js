import {
  ADDSNIPPETDATA, GETSNIPPETDATA, 
  SETSNIPPETDATA, DELETESNIPPETDATA,
  SETCURRENTSNIPPETDATA,
  ADDTAG, REMOVETAG,
  SETLANGUAGE
} from '../reducers/const'

export const snippetReducer = (state = [], action) => {
	//console.log("snipet reducer", state, action);
  switch (action.type) {
    case SETSNIPPETDATA:
      return action.data;
    case ADDSNIPPETDATA:
      return [...state, action.data];
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

export const currentSnippetReducer = (state={}, action)=>{
	switch(action.type){
	    case SETCURRENTSNIPPETDATA:
    		return action.data;
    	default:
    		return state;
	}
}