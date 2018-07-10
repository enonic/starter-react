import { fromJS } from 'immutable';
import * as mainActions from '../actions/mainActions'

const initialState = fromJS({
  allItems: [],
  cartItems: [],
  visibleItem: [],
  categories: [],
  toaster : {
    visible : false,
    message : ""
  }
});

function createItem(oldState, action){
  let state = oldState
  state = state.updateIn(['allItems'], function (items) {
    items = items.push(action.item)
    return items
  });
  return state
}

function deleteItem(oldState, action){
  let state = oldState
  state = state.updateIn(['allItems'], function (items) {
    items = items.splice(items.indexOf(action.item), 1)
    return items
  });
  return state
}

function changeItem(oldState, action){
  let state = oldState
  return state
}

function addItemToCart(oldState, action){
  let state = oldState
  state = state.updateIn(['cartItems'], function (items) {
    items = items.push(action.item)
    return items
  });
  return state
}

function removeItemFromCart(oldState, action){
  let state = oldState
  state = state.updateIn(['cartItems'], function (items) {
    items = items.splice(items.indexOf(action.item), 1)
    return items
  });
  return state
}

function toggleItemVisible(oldState, action){
  let state = oldState
  state = state.updateIn(["allItems"], function(items) {
    action.item.visible = action.item.visible ? false : true;
    items = items.splice(items.indexOf(action.item), 1, action.item)
    return items;
  });
  return state
}

function createCategory(oldState, action){
  let state = oldState
  state = state.updateIn(['categories'], function (categories) {
    categories = categories.push(action.item)
    return categories
  });
  return state
}

function deleteCategory(oldState, action){
  let state = oldState
  state = state.updateIn(["categories"], function(categories) {
    categories = categories.splice(categories.indexOf(action.item), 1)
    return categories;
  });
  return state
}

function hideCategory(oldState, action){
  let state = oldState
  state = state.updateIn(["categories"], function(categories) {
    action.item.visible = action.item.visible ? false : true;
    categories = categories.splice(categories.indexOf(action.item), 1, action.item)
    return categories;
  });
  return state
}

function showToaster(oldState, action){
  let state = oldState
  state = state.updateIn(["toaster"], function(toaster) {
    toaster = toaster.set('visible', true)
    toaster = toaster.set('message', action.message)
    return toaster;
  });
  return state
}

function hideToaster(oldState, action){
  let state = oldState
  state = state.updateIn(["toaster"], function(toaster) {
    toaster = toaster.set('visible', false)
    toaster = toaster.set('message', "")
    return toaster;
  });
  return state
}


function checkout(oldState, action){
  let state = oldState
  state = state.updateIn(["cartItems"], function(items) {
    items.forEach(item => {
      items = items.splice(items.indexOf(item), 1)
    })
    
    return items;
  });
  return state
}



export function mainReducer(state = initialState, action) {
  switch (action.type) {
    
    case mainActions.actions.toggleCategoryVisible:
      return hideCategory(state, action)
    case mainActions.actions.deleteCategory:
      return deleteCategory(state, action)
    case mainActions.actions.createCategory:
      return createCategory(state, action)
    
    
    case mainActions.actions.checkout:
      return checkout(state, action)
    
    
    case mainActions.actions.hideToaster:
      return hideToaster(state, action)
    case mainActions.actions.showToaster:
      return showToaster(state, action)
    
    
    
    case mainActions.actions.removeItemFromCart:
      return removeItemFromCart(state, action)
    case mainActions.actions.addItemToCart:
      return addItemToCart(state, action)
      
      
    case mainActions.actions.toggleItemVisible:
        return toggleItemVisible(state, action)
    case mainActions.actions.changeItem:
      return changeItem(state, action)
    case mainActions.actions.deleteItem:
      return deleteItem(state, action)
    case mainActions.actions.createItem:
      return createItem(state, action)


    default:
      return state;
  }
}