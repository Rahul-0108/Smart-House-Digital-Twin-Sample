import { IModelApp } from "@bentley/imodeljs-frontend";
import { AbstractMenuItemProps } from "@bentley/ui-abstract";

// https://www.itwinjs.org/learning/ui/core/contextmenu/#uiadminshowcontextmenu-example
export const myMenuItems: AbstractMenuItemProps[] = [
 {
  id: "Item1",
  label: "Item ~1",
  icon: "icon-placeholder",
  submenu: [
   { id: "0", item: { label: "SubMenu Item ~1", icon: "icon-placeholder", execute: () => {} } },
   { id: "1", item: { label: "SubMenu Item ~2", icon: "icon-placeholder", execute: () => {} } },
  ],
 },
 {
  id: "Item2",
  item: { label: "Item ~2", icon: "icon-placeholder", execute: () => {} },
 },
 {
  id: "Item3",
  item: { label: "Item ~3", icon: "icon-placeholder", execute: () => {} },
 },
];

export const showContextMenu = () => {
 IModelApp.uiAdmin.showContextMenu(myMenuItems, IModelApp.uiAdmin.cursorPosition); // Show Context Menu at current curson position
};
