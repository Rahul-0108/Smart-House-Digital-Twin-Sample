import { createStore, combineReducers } from "redux";
import { widgetReducer } from "./Reducer";
import { composeWithDevTools } from "redux-devtools-extension";

export const store = createStore(combineReducers({ widget: widgetReducer }), composeWithDevTools());
