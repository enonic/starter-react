export const actions = {
    hideToaster: 'HIDE_TOASTER',
    showToaster: 'SHOW_TOASTER'
  }
  
  const timeOut = null
 
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
  