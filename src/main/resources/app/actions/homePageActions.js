// fetch api
export const actions = {
  doSomething: 'DO_SOMETHING'
}

function something(arg){
  return {
    type: actions.doSomething,	
    data: arg
  }
}


export function doSomething(dispatch, arg){ 
    //promise 
    dispatch(something(arg))
}
   