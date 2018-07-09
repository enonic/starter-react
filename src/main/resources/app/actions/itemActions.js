// fetch api
export const actions = {
  createItem: 'CREATE_ITEM',
  deleteItem: 'DELETE_ITEM',
  changeItem: 'CHANGE_ITEM',
  addItemToCart: 'ADD_ITEM_TO_CART',
  removeItemFromCart: 'REMOVE_ITEM_FROM_CART'
}

function createAction(arg){
  return {
    type: actions.createItem,	
    data: arg
  }
}

function deleteAction(arg){
  return {
    type: actions.deleteItem,	
    data: arg
  }
}

function changeAction(arg){
  return {
    type: actions.changeItem,	
    data: arg
  }
}

function addItemToCartAction(arg){
  return {
    type: actions.addItemToCart,	
    data: arg
  }
}

function removeItemFromCartAction(arg){
  return {
    type: actions.removeItemFromCart,	
    data: arg
  }
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