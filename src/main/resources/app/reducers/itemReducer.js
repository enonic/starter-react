import { fromJS } from 'immutable';
import  * as Item from '../actions/itemActions'

const initialState = fromJS({
  allItems: ["item1", "item2"],
  cartItems: []
});

function createItem(oldState, action){
  let state = oldState
  return state
}

function deleteItem(oldState, action){
  let state = oldState
  return state
}

function changeItem(oldState, action){
  let state = oldState
  return state
}

function addItemToCart(oldState, action){
  let state = oldState
  return state
}

function removeItemFromCart(oldState, action){
  let state = oldState
  return state
}



export function itemReducer(state = initialState, action) {
  switch (action.type) {
    case Item.actions.removeItemFromCart:
      return removeItemFromCart(state, action)
    case Item.actions.addItemToCart:
      return addItemToCart(state, action)
    case Item.actions.changeItem:
      return changeItem(state, action)
    case Item.actions.deleteItem:
      return deleteItem(state, action)
    case Item.actions.createItem:
      return createItem(state, action)
    default:
      return state;
  }
}