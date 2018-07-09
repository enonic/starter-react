// fetch api
export const actions = {
  createItem: 'CREATE_ITEM',
  deleteItem: 'DELETE_ITEM',
  changeItem: 'CHANGE_ITEM',
  addItemToCart: 'ADD_ITEM_TO_CART',
  removeItemFromCart: 'REMOVE_ITEM_FROM_CART',
  toggleVisible: 'TOGGLE_VISIBLE',
  addCategory: 'ADD_CATEGORY'
}

function addCategoryAction(arg) {
  return {
    type: actions.addCategory,
    item: arg
  }
}

function createAction(arg){
  return {
    type: actions.createItem,	
    item: arg
  }
}

function deleteAction(arg){
  return {
    type: actions.deleteItem,	
    item: arg
  }
}

function changeAction(arg){
  return {
    type: actions.changeItem,	
    item: arg
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

function toggleVisibleAction(arg){
  return {
    type: actions.toggleVisible,
    item: arg
  }
}


export function addCategory(dispatch, arg){
  dispatch(addCategoryAction(arg))
}

export function toggleVisible(dispacth, arg){
  dispatch(toggleVisibleAction(arg))
}

export function createItem(dispatch, arg){ 
    //promise 
    dispatch(createAction(arg))
}

export function deleteItem(dispatch, arg){ 
    //promise 
    dispatch(deleteAction(arg))
}

export function changeItem(dispatch, arg){ 
  //promise 
  dispatch(changeAction(arg))
}

export function addItemToCart(dispatch, arg){ 
  //promise 
  dispatch(addItemToCartAction(arg))
}

export function removeItemFromCart(dispatch, arg){ 
  //promise 
  dispatch(removeItemFromCartAction(arg))
}