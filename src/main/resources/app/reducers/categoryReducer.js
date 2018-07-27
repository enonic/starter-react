import { fromJS } from 'immutable';
import * as categoryActions from '../actions/categoryActions'
import * as repoService from '../services/repoService';

const initialState = fromJS({
  categories: [],
  deletedCategories: [],
  edited: false
});


function sortCategories(state){
  state = state.updateIn(['categories'], function (categories) {
    return categories.sort((a,b) => b.id - a.id)
  })
  return state
}

function createCategory(oldState, action){
  let state = oldState
  state = state.updateIn(['categories'], function (categories) {
    categories = categories.push(action.category)
    return categories
  });
  if(action.edit){
    state = state.set('edited', true)
  }
  state = sortCategories(state)
  return state
}

function deleteCategory(oldState, action){
  let state = oldState
  state = state.updateIn(['categories'], function (categories) {
    categories = categories.splice(categories.indexOf(action.category), 1)
    return categories
  });
  state = state.updateIn(['deletedCategories'], function (categories) {
    categories = categories.push(action.category)
    return categories
  });
  state = state.set('edited', true)
  return state
}

function toggleCategoryVisible(oldState, action){
  let state = oldState
  state = state.updateIn(["categories"], function(categories) {
    action.category.visible = action.category.visible ? false : true;
    action.category.edited = true
    categories = categories.splice(categories.indexOf(action.category), 1, action.category)
    return categories;
  });
  state = state.set('edited', true)
  return state
}

function changeCategory(oldState, action){
  let state = oldState
  state = state.updateIn(['categories'], function (categories) {
    let category = categories.find(categorie => categorie.id == action.data.id)
    let oldCategoy = category
    category.update(action.data)
    categories = categories.splice(categories.indexOf(oldCategoy), 1, category)
    return categories
  });
  state = state.set('edited', true)
  return state
}


function save(oldState, action){
  let state = oldState
  state = state.updateIn(["categories"], function(categories) {
    categories.forEach(category => {
      if(category.edited){
        category.edited = false
        repoService.editCategory(category)
      }
    })
    return categories;
  });
  state = state.updateIn(["deletedCategories"], function(categories) {
    categories.forEach(category => {
      repoService.removeCategory(category)
    })
    return fromJS([]);
  });

  state = state.set('edited', false)
  return state
}

function cancelSave(oldState, action){
  let state = oldState
  state = state.updateIn(["categories"], function(categories) {
    return fromJS(action.categories)
  })
  state = state.updateIn(["deletedCategories"], function() {
    return fromJS([])
  })
  state = state.set('edited', false)  
  state = sortCategories(state)
  return state
}



export function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case categoryActions.actions.cancelSave:
      return cancelSave(state,action)
    case categoryActions.actions.save:
      return save(state,action)
    case categoryActions.actions.changeCategory:
      return changeCategory(state,action)
    case categoryActions.actions.toggleCategoryVisible:
      return toggleCategoryVisible(state, action)
    case categoryActions.actions.deleteCategory:
      return deleteCategory(state, action)
    case categoryActions.actions.createCategory:
      return createCategory(state, action)

      
    default:
      return state;
  }
}