import { ActionType, setElement } from "./Action";

const widgetState = { selectedElement: {} };

export const widgetReducer = (state = widgetState, action: ActionType) => {
 switch (action.type) {
  case setElement:
   return { ...state, selectedElement: action.payload };
  default:
   return state;
 }
};
