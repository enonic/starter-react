import * as toasterActions from './toasterActions';

import * as repo from '../services/repoService';

// fetch api
export const actions = {
  createItem: 'CREATE_ITEM',
  deleteItem: 'DELETE_ITEM',
  changeItem: 'CHANGE_ITEM',
  toggleItemVisible: 'TOGGLE_VISIBLE',

  addItemToCart: 'ADD_ITEM_TO_CART',
  removeItemFromCart: 'REMOVE_ITEM_FROM_CART',

  checkout: 'CHECKOUT',

  searchCategory: 'SEARCH_CATEGORY',
}


function createItemAction(arg){
  return {
    type: actions.createItem,	
    item: arg
  }
}

function deleteItemAction(arg){
  return {
    type: actions.deleteItem,	
    item: arg
  }
}

function changeItemAction(item){
  return {
    type: actions.changeItem,	
    item: item
  }
}

function addItemToCartAction(arg){
  return {
    type: actions.addItemToCart,	
    item: arg
  }
}

function removeItemFromCartAction(arg){
  return {
    type: actions.removeItemFromCart,	
    item: arg
  }
}

function toggleItemVisibleAction(arg){
  return {
    type: actions.toggleItemVisible,
    item: arg
  }
}


function checkoutAction(){
  return {
    type: actions.checkout,
  }
}


function searchCategoryAction(arg){
  return {
    type: actions.searchCategory,
    data: arg
  }
}

export function searchCategory(dispatch, arg){
  dispatch(searchCategoryAction(arg))
}


export function checkout(dispatch){
  toasterActions.showToaster(dispatch, "Thank you for your purchase!")
  dispatch(checkoutAction())
}


export function toggleItemVisible(dispatch, arg){
  dispatch(toggleItemVisibleAction(arg))
}

export function createItem(dispatch, arg){ 
    //promise 
    repo.add(arg)
    dispatch(createItemAction(arg))
}

export function deleteItem(dispatch, arg){ 
    //promise 
    dispatch(deleteItemAction(arg))
}

export function changeItem(dispatch, item){ 
  //promise 
  dispatch(changeItemAction(item))
}

export function addItemToCart(dispatch, arg){ 
  //promise 
  toasterActions.showToaster(dispatch, "Item was added to cart")
  dispatch(addItemToCartAction(arg))
}

export function removeItemFromCart(dispatch, arg){ 
  //promise 
  dispatch(removeItemFromCartAction(arg))
}