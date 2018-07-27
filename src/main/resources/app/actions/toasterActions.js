export const actions = {
    hideToaster: 'HIDE_TOASTER',
    showToaster: 'SHOW_TOASTER'
}
  
var timeOut = null

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

  clearTimeout(timeOut)
  timeOut = setTimeout( () => hideToaster(dispatch) ,3000);
  dispatch(showToasterAction(arg))
}



export function hideToaster(dispatch){
  dispatch(hideToasterAction())
}
  