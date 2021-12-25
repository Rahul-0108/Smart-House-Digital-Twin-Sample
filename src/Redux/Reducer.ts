import { DeepReadonly, FrameworkState, ReducerRegistryInstance } from "@bentley/ui-framework";
import { AppActionId, AppActionsUnion } from "./Action";

export interface AppState {
 selectedSmartDeviceElement: any;
 showGeometryDecorator: boolean;
}
export interface RootState {
 frameworkState?: FrameworkState;
 appState: AppState;
}

const initialAppState: AppState = { selectedSmartDeviceElement: undefined, showGeometryDecorator: false };

export function AppReducer(state: AppState = initialAppState, action: AppActionsUnion): DeepReadonly<AppState> {
 switch (action.type) {
  case AppActionId.set_Selected_SmartDevice_Element:
   return { ...state, selectedSmartDeviceElement: action.payload };
  case AppActionId.set_Show_Geometry_Decorator:
   return { ...state, showGeometryDecorator: action.payload };
  default:
   return state;
 }
}

// http://nicolasgallagher.com/redux-modules-and-code-splitting/
export const registerReducers = () => {
 if (!Object.keys(ReducerRegistryInstance.getReducers()).includes("appState")) {
  ReducerRegistryInstance.registerReducer("appState", AppReducer);
 }
};

//  Dispatch Action using UiFramework.dispatchActionToStore
//  useSelector for getting Store Values
//  For syncUiEvent, We can use StateManager.store.getState() to get the state value from the Redux Store
