import { fromJS } from 'immutable';
import  * as somethingActions from '../actions/homePageActions'

const initialState = fromJS({
  data: "something"
});

function doSomethingToState(oldState, action){
  let state = oldState
  state = state.set('data', action.data)
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