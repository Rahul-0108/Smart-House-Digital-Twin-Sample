import { ActionCreatorsObject, ActionsUnion, createAction } from "@bentley/ui-framework";

export enum AppActionId {
 set_Selected_SmartDevice_Element = "app:set_selected_smartdevice_element", //lower case so it can serve as a sync event when called via UiFramework.dispatchActionToStore
}

const AppActions: ActionCreatorsObject = {
 setSelectedSmartDeviceElement: (element: any) => createAction(AppActionId.set_Selected_SmartDevice_Element, element),
};

export type AppActionsUnion = ActionsUnion<typeof AppActions>;
