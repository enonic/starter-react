import { fromJS } from 'immutable';
import * as toasterActions from '../actions/toasterActions'

const initialState = fromJS({
    visible : false,
    message : ""
});

var interval = null;

function showToaster(oldState, action){
  let state = oldState
  clearInterval(interval)
  state = state.set('visible', true)
  state = state.set('message', action.message)
  return state
}

function hideToaster(oldState){
  let state = oldState
  state = state.set('visible', false)
  interval = setTimeout(() => () => state = state.set('message', "") ,500);
  
  return state
}


export function toasterReducer(state = initialState, action) {
  switch (action.type) {
    case toasterActions.actions.hideToaster:
      return hideToaster(state)
    case toasterActions.actions.showToaster:
      return showToaster(state, action)
    default:
      return state;
  }
}