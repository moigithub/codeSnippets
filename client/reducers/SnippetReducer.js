import {GETSNIPPETDATA,SETSNIPPETDATA, SETCURRENTSNIPPETDATA} from '../reducers/const'

export const snippetReducer = (state = [], action) => {
	//console.log("snipet reducer", state, action);
  switch (action.type) {
    case SETSNIPPETDATA:
      return action.data;
    case GETSNIPPETDATA:
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