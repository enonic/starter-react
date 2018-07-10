// fetch api
export const actions = {
  createItem: 'CREATE_ITEM',
  deleteItem: 'DELETE_ITEM',
  changeItem: 'CHANGE_ITEM',
  toggleItemVisible: 'TOGGLE_VISIBLE',

  addItemToCart: 'ADD_ITEM_TO_CART',
  removeItemFromCart: 'REMOVE_ITEM_FROM_CART',

  createCategory: 'ADD_CATEGORY',
  deleteCategory: 'DELETE_CATEGORY',
  toggleCategoryVisible: 'HIDE_CATEGORY',

  hideToaster: 'HIDE_TOASTER',
  showToaster: 'SHOW_TOASTER',
  checkout: 'CHECKOUT'
}

const timeOut = null

function changeCategoryAction(item, arg) {
  return {
    type: actions.addCategory,
    item: item,
    data: arg
  }
}

function createCategoryAction(arg) {
  return {
    type: actions.addCategory,
    item: arg
  }
}

function deleteCategoryAction(arg) {
  return {
    type: actions.addCategory,
    item: arg
  }
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

function changeItemAction(item, arg){
  return {
    type: actions.changeItem,	
    item: item,
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


function hideToasterAction(){
  return {
    type: actions.hideToaster
  }
}


function showToasterAction(arg){
  return {
    type: actions.showToaster,
    message: arg
  }
}

function checkoutAction(){
  return {
    type: actions.checkout,
  }
}

function toggleCategoryVisibleAction(){
  return {
    type: actions.checkout,
  }
}


export function checkout(dispatch){
  showToaster(dispatch, "Thank you for your purchase!")
  dispatch(checkoutAction())
}

export function showToaster(dispatch, arg){
  if(timeOut){
    clearTimeout(timeOut)
  }
  setTimeout( () => hideToaster(dispatch) ,3000);
  dispatch(showToasterAction(arg))
}


export function hideToaster(dispatch){
  dispatch(hideToasterAction())
}

export function changeCategory(dispatch, item, arg){
  dispatch(changeCategoryAction(item, arg))
}

export function deleteCategory(dispatch, arg){
  dispatch(deleteCategoryAction(arg))
}

export function toggleCategoryVisible(dispatch){
  dispatch(toggleCategoryVisibleAction())
}

export function createCategory(dispatch, arg){
  dispatch(createCategoryAction(arg))
}

export function toggleItemVisible(dispatch, arg){
  dispatch(toggleItemVisibleAction(arg))
}

export function createItem(dispatch, arg){ 
    //promise 
    dispatch(createItemAction(arg))
}

export function deleteItem(dispatch, arg){ 
    //promise 
    dispatch(deleteItemAction(arg))
}

export function changeItem(dispatch, item, arg){ 
  //promise 
  dispatch(changeItemAction(item, arg))
}

export function addItemToCart(dispatch, arg){ 
  //promise 
  showToaster(dispatch, "Item was added to cart")
  dispatch(addItemToCartAction(arg))
}

export function removeItemFromCart(dispatch, arg){ 
  //promise 
  dispatch(removeItemFromCartAction(arg))
}