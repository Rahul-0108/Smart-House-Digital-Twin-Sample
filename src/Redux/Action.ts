import { ActionCreatorsObject, ActionsUnion, createAction } from "@bentley/ui-framework";

export enum AppActionId {
 set_Selected_SmartDevice_Element = "app:set_selected_smartdevice_element", //lower case so it can serve as a sync event when called via UiFramework.dispatchActionToStore
 set_Show_Geometry_Decorator = "et_show_geometry_decorator",
}

const AppActions: ActionCreatorsObject = {
 setSelectedSmartDeviceElement: (element: any) => createAction(AppActionId.set_Selected_SmartDevice_Element, element),
 setShowGeometryDecorator: (flag: any) => createAction(AppActionId.set_Show_Geometry_Decorator, flag),
};

export type AppActionsUnion = ActionsUnion<typeof AppActions>;
