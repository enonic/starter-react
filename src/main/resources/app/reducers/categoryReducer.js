import { fromJS } from 'immutable';
import * as categoryActions from '../actions/categoryActions'

const initialState = fromJS(
  []
);


function createCategory(oldState, action){
  let state = oldState
  state = state.push(action.category)
  return state
}

function deleteCategory(oldState, action){
  let state = oldState
  state = state.splice(categories.indexOf(action.category), 1)
  return state
}

function hideCategory(oldState, action){
  let state = oldState
  action.category.visible = action.category.visible ? false : true;
  state = state.splice(categories.indexOf(action.category), 1, action.category)
  return state
}



export function categoryReducer(state = initialState, action) {
  switch (action.type) {
    
    case categoryActions.actions.toggleCategoryVisible:
      return hideCategory(state, action)
    case categoryActions.actions.deleteCategory:
      return deleteCategory(state, action)
    case categoryActions.actions.createCategory:
      return createCategory(state, action)

    default:
      return state;
  }
}