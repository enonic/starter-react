import { combineReducers } from 'redux-immutable';
import { mainReducer } from './mainReducer';
import { categoryReducer } from './categoryReducer';
import { toasterReducer } from './toasterReducer'; 

export default function createRootReducer() {
  return combineReducers({
    app: mainReducer,
    categories: categoryReducer,
    toaster: toasterReducer
  });
}