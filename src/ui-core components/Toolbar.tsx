import {
 FitViewTool,
 IModelApp,
 PanViewTool,
 RotateViewTool,
 SelectionTool,
 WindowAreaTool,
 ZoomViewTool,
} from "@bentley/imodeljs-frontend";
import { AbstractToolbarProps, BadgeType } from "@bentley/ui-abstract";
import { ActionButtonItemDef } from "@bentley/ui-framework";

// https://www.itwinjs.org/learning/ui/abstract/uiadmin/#showtoolbar
const _exampleToolbar = (): AbstractToolbarProps => {
 return {
  toolbarId: "example-toolbar",
  items: [
   {
    id: SelectionTool.toolId,
    itemPriority: 10,
    icon: SelectionTool.iconSpec,
    label: SelectionTool.flyover,
    description: SelectionTool.description,
    execute: () => IModelApp.tools.run(SelectionTool.toolId),
   },
   {
    id: FitViewTool.toolId,
    itemPriority: 20,
    icon: FitViewTool.iconSpec,
    label: FitViewTool.flyover,
    description: FitViewTool.description,
    execute: () => IModelApp.tools.run(FitViewTool.toolId, IModelApp.viewManager.selectedView, true),
   },
   {
    id: WindowAreaTool.toolId,
    itemPriority: 30,
    icon: WindowAreaTool.iconSpec,
    label: WindowAreaTool.flyover,
    description: WindowAreaTool.description,
    execute: () => IModelApp.tools.run(WindowAreaTool.toolId, IModelApp.viewManager.selectedView),
   },
   {
    id: ZoomViewTool.toolId,
    itemPriority: 40,
    icon: ZoomViewTool.iconSpec,
    label: ZoomViewTool.flyover,
    description: ZoomViewTool.description,
    execute: () => IModelApp.tools.run(ZoomViewTool.toolId, IModelApp.viewManager.selectedView),
   },
   {
    id: PanViewTool.toolId,
    itemPriority: 50,
    icon: PanViewTool.iconSpec,
    label: PanViewTool.flyover,
    description: PanViewTool.description,
    execute: () => IModelApp.tools.run(PanViewTool.toolId, IModelApp.viewManager.selectedView),
   },
   {
    id: RotateViewTool.toolId,
    itemPriority: 60,
    icon: RotateViewTool.iconSpec,
    label: RotateViewTool.flyover,
    description: RotateViewTool.description,
    execute: () => IModelApp.tools.run(RotateViewTool.toolId, IModelApp.viewManager.selectedView),
   },
   {
    id: "example-mode-1",
    itemPriority: 70,
    label: "Mode 1",
    icon: "icon-placeholder",
    badgeType: BadgeType.New,
    execute: () => {},
   },
   {
    id: "example-mode-2",
    itemPriority: 80,
    label: "Mode 2",
    icon: "icon-placeholder",
    badgeType: BadgeType.TechnicalPreview,
    execute: () => {},
   },
  ],
 };
};
const _toolbarItemExecuted = (_item: ActionButtonItemDef) => {};
function _closeToolbar() {
 IModelApp.uiAdmin.hideToolbar();
}
export const showToolbar = () => {
 IModelApp.uiAdmin.showToolbar(
  _exampleToolbar(),
  IModelApp.uiAdmin.createXAndY(150, 100),
  IModelApp.uiAdmin.createXAndY(8, 8),
  _toolbarItemExecuted,
  _closeToolbar
 );
};
