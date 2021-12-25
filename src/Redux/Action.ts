import { Point3d } from "@bentley/geometry-core";
import { ActionCreatorsObject, ActionsUnion, createAction } from "@bentley/ui-framework";

export enum AppActionId {
 set_Selected_SmartDevice_Element = "app:set_selected_smartdevice_element", //lower case so it can serve as a sync event when called via UiFramework.dispatchActionToStore
 set_Show_Geometry_Decorator = "set_show_geometry_decorator",
 set_Pin_Locations = "set_pin_locations",
}

const AppActions: ActionCreatorsObject = {
 setSelectedSmartDeviceElement: (element: any) => createAction(AppActionId.set_Selected_SmartDevice_Element, element),
 setShowGeometryDecorator: (flag: any) => createAction(AppActionId.set_Show_Geometry_Decorator, flag),
 setPinLocations: (pins: Point3d[]) => createAction(AppActionId.set_Pin_Locations, pins),
};

export type AppActionsUnion = ActionsUnion<typeof AppActions>;
