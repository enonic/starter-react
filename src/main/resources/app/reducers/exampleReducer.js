import { fromJS } from 'immutable';

const initialState = fromJS({
  data: "something"
});

function doSomethingToState(oldState,action){
  let state = oldState
  // change state
  return state
}

export function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case 'DO_SOMETHING':
      return doSomethingToState(state, action)
    default:
      return state;
  }
}