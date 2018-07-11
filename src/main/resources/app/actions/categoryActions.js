// fetch api
export const actions = {
    createCategory: 'ADD_CATEGORY',
    deleteCategory: 'DELETE_CATEGORY',
    toggleCategoryVisible: 'HIDE_CATEGORY',
    changeCategory: 'CHANGE_CATEGORY',
    
  }
  
  function changeCategoryAction(category, arg) {
    return {
      type: actions.changeCategory,
      category: category,
      data: arg
    }
  }
  
  function createCategoryAction(arg) {
    return {
      type: actions.createCategory,
      category: arg
    }
  }
  
  function deleteCategoryAction(arg) {
    return {
      type: actions.deleteCategory,
      category: arg
    }
  }
  
  
  function toggleCategoryVisibleAction(arg){
    return {
      type: actions.toggleCategoryVisible,
      category: arg
    }
  }
  


  export function changeCategory(dispatch, category, arg){
    dispatch(changeCategoryAction(category, arg))
  }
  
  export function deleteCategory(dispatch, arg){
    dispatch(deleteCategoryAction(arg))
  }
  
  export function toggleCategoryVisible(dispatch, arg){
    dispatch(toggleCategoryVisibleAction(arg,))
  }
  
  export function createCategory(dispatch, arg){
    dispatch(createCategoryAction(arg))
  }
  