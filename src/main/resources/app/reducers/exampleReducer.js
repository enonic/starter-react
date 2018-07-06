import { fromJS } from 'immutable';
import  * as somethingActions from '../actions/homePageActions'

const initialState = fromJS({
  data: "data"
});

function doSomethingToState(oldState, action){
  let state = oldState
  return state
}

export function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case somethingActions.actions.doSomething:
      return doSomethingToState(state, action)
    default:
      return state;
  }
}