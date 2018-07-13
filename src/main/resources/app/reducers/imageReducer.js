import { fromJS } from 'immutable';
import * as imageActions from '../actions/imageActions'

const initialState = fromJS(
    []
); 


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


export function imageReducer(state = initialState, action) {
    switch (action.type) {
        case imageActions.actions.addImage:
            return addImage(state, action)
        case imageActions.actions.deleteImage:
            return deleteImage(state, action)
        default:
            return state;
    }
}