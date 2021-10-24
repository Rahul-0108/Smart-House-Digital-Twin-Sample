import { IModelApp } from "@bentley/imodeljs-frontend";
import { AbstractMenuItemProps, BadgeType } from "@bentley/ui-abstract";

// https://www.itwinjs.org/learning/ui/abstract/uiadmin/#showmenubutton
const _exampleMenuItems: AbstractMenuItemProps[] = [
 {
  id: "Mode",
  label: "~Mode",
  icon: "icon-placeholder",
  badgeType: BadgeType.New,
  submenu: [
   { id: "0", item: { label: "Mode 1", icon: "icon-placeholder", badgeType: BadgeType.New, execute: () => {} } },
   { id: "1", item: { label: "Mode 2", icon: "icon-placeholder", badgeType: BadgeType.TechnicalPreview, execute: () => {} } },
  ],
 },
 {
  id: "Rotate",
  label: "~Rotate",
  icon: "icon-placeholder",
  submenu: [
   { id: "0", item: { label: "Rotate 1", icon: "icon-placeholder", execute: () => {} } },
   { id: "1", item: { label: "Rotate 2", icon: "icon-placeholder", execute: () => {} } },
  ],
 },
 {
  id: "LockToAxis",
  item: { label: "~Lock to Axis", icon: "icon-placeholder", badgeType: BadgeType.TechnicalPreview, execute: () => {} },
 },
 {
  id: "MoveOrigin",
  item: { label: "Move ~Origin", icon: "icon-placeholder", execute: () => {} },
 },
 {
  id: "Hide",
  item: { label: "~Hide", icon: "icon-placeholder", execute: () => {} },
 },
 {
  id: "Settings",
  label: "~Settings",
  icon: "icon-placeholder",
  submenu: [
   { id: "0", item: { label: "Settings 1", icon: "icon-placeholder", execute: () => {} } },
   { id: "1", item: { label: "Settings 2", icon: "icon-placeholder", execute: () => {} } },
  ],
 },
];

export const showMenu = () => {
 const viewport = IModelApp.viewManager.selectedView;
 if (viewport) {
  IModelApp.uiAdmin.showMenuButton("test1", _exampleMenuItems, IModelApp.uiAdmin.createXAndY(150, 150), viewport.toolTipDiv);
 }
};
