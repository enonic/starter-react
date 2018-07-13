import { fromJS } from 'immutable';
import * as imageActions from '../actions/imageActions'

const initialState = fromJS({
    images : []
}); 


function addImage(oldState, action) {
    let state = oldState
    state = state.push(action.image); 
    return state
}

function deleteImage(oldState, action) {
    let state = oldState
    state = state.splice(state.indexOf(action.image), 1); 
    return state
}



export function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case imaegActions.actions.deleteImage:
            return deleteCategory(state, action)
        case imaegActions.actions.addImage:
            return createCategory(state, action)

        default:
            return state;
    }
}