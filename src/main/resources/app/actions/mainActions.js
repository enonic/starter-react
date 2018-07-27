import * as toasterActions from './toasterActions';

import * as repoService from '../services/repoService';

import Item from '../interfaces/item';

// fetch api
export const actions = {
  createItem: 'CREATE_ITEM',
  deleteItem: 'DELETE_ITEM',
  changeItem: 'CHANGE_ITEM',
  save: 'SAVE_ITEM',
  cancelSave: 'CANCEL_SAVE',
  toggleItemVisible: 'TOGGLE_VISIBLE',

  addItemToCart: 'ADD_ITEM_TO_CART',
  removeItemFromCart: 'REMOVE_ITEM_FROM_CART',

  checkout: 'CHECKOUT',

  searchCategory: 'SEARCH_CATEGORY',
}


function createItemAction(arg, edit){
  return {
    type: actions.createItem,	
    item: arg,
    edit: edit
  }
}

function deleteItemAction(arg){
  return {
    type: actions.deleteItem,	
    item: arg
  }
}

function changeItemAction(arg){
  return {
    type: actions.changeItem,	
    data: arg
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

function saveAction(){
  return {
    type: actions.save,
  }
}

function cancelSaveAction(items){
  return {
    type: actions.cancelSave,
    items: items
  }
}

export function cancelSave(dispatch){
  repoService.getItems().then(response =>
    response = response.map(data => new Item(data))
  ).then(items =>
    dispatch(cancelSaveAction(items))
  )
}

export function save(dispatch){
  toasterActions.showToaster(dispatch, "Saved")
  dispatch(saveAction())
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

export function createItem(dispatch, arg, edit){ 
    //promise 
    //repo.add(arg)
    dispatch(createItemAction(arg, edit))
}

export function deleteItem(dispatch, arg){ 
    //promise 
    dispatch(deleteItemAction(arg))
}

export function changeItem(dispatch, arg){ 
  //promise 
  dispatch(changeItemAction(arg))
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