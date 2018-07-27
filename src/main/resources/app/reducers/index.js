import { combineReducers } from 'redux-immutable';
import { mainReducer } from './mainReducer';
import { categoryReducer } from './categoryReducer';
import { toasterReducer } from './toasterReducer'; 
import { imageReducer } from './imageReducer';

export default function createRootReducer() {
  return combineReducers({
    app: mainReducer,
    categories: categoryReducer,
    toaster: toasterReducer,
    images : imageReducer
  });
}