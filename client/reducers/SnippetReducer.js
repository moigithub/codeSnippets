import {SNIPPETDATA} from '../reducers/const'

export const snippetReducer = (state = [], action) => {
  switch (action.type) {
    case SNIPPETDATA:
      return [...state, action.data ];
    default:
      return state;
  }
}