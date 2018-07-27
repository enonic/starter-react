import * as repoService from '../services/repoService';
import Category from '../interfaces/category';

// fetch api
export const actions = {
    createCategory: 'ADD_CATEGORY',
    deleteCategory: 'DELETE_CATEGORY',
    toggleCategoryVisible: 'HIDE_CATEGORY',
    changeCategory: 'CHANGE_CATEGORY',
    save: 'SAVE_CATEGORIES',
    cancelSave: 'CANCEL_SAVE_CATEGORIES'
    
  }
  
  function changeCategoryAction(arg) {
    return {
      type: actions.changeCategory,
      data: arg
    }
  }
  
  function createCategoryAction(arg, edit) {
    return {
      type: actions.createCategory,
      category: arg,
      edit: edit
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
  
  function saveAction(){
    return {
      type: actions.save
    }
  }
  
  function cancelSaveAction(categories){
    return {
      type: actions.cancelSave,
      categories: categories
    }
  }
  


  export function cancelSave(dispatch){
    repoService.getCategories().then(response =>
      response = response.map(data => new Category(data))
    ).then(categories =>
      dispatch(cancelSaveAction(categories))
    )
  }


  export function save(dispatch){
    dispatch(saveAction())
  }


  export function changeCategory(dispatch, arg){
    dispatch(changeCategoryAction(arg))
  }
  
  export function deleteCategory(dispatch, arg){
    dispatch(deleteCategoryAction(arg))
  }
  
  export function toggleCategoryVisible(dispatch, arg){
    dispatch(toggleCategoryVisibleAction(arg,))
  }
  
  export function createCategory(dispatch, arg, edit){
    dispatch(createCategoryAction(arg, edit))
  }
  