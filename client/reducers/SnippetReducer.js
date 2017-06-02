import {GETSNIPPETDATA,SETSNIPPETDATA} from '../reducers/const'

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