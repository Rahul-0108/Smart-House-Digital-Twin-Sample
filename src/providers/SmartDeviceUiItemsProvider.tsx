import { ColorDef } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import {
 UiItemsProvider,
 ToolbarUsage,
 ToolbarOrientation,
 CommonToolbarItem,
 StageUsage,
 ToolbarItemUtilities,
 StagePanelLocation,
 StagePanelSection,
 AbstractWidgetProps,
} from "@bentley/ui-abstract";
import { Toggle } from "@bentley/ui-core";
import React from "react";
import CameraPath from "./CameraPath";
import { SmartDeviceProperties } from "./SmartDeviceProperties";
import { SmartDeviceListWidgetComponent } from "./SmartDeviceListWidgetComponent";

export class SmartDeviceUiItemsProvider implements UiItemsProvider {
 public readonly id = "SmartDeviceUiProvider";
 private _toggleWalls: boolean = false;
 private static toggledOnce: boolean = false;
 private static originalColor: number;

 public provideToolbarButtonItems(
  stageId: string,
  stageUsage: string,
  toolbarUsage: ToolbarUsage,
  toolbarOrientation: ToolbarOrientation
 ): CommonToolbarItem[] {
  const toolbarButtonItems: CommonToolbarItem[] = [];

  if (
   // Make sure We Add the New ToolBar  Button at the right Place
   stageUsage === StageUsage.General && // We will attach the Button to the General  Stage Area The Default  Stage
   toolbarUsage === ToolbarUsage.ContentManipulation &&
   toolbarOrientation === ToolbarOrientation.Vertical
  ) {
   const toggleWallsButton = ToolbarItemUtilities.createActionButton(
    "ToggleWalls",
    1000, // We want to add out new Tool Button at Bottom , so using itemPriority at maximum
    "icon-element", // @bentley/iconsgeneric has a lot of icons, so We will use one from it,We Need to prefix with "icon-"
    "Toggle Walls Tool", // For  ToolTip
    () => {
     // Action on Click
     this._toggleWalls = !this._toggleWalls;
     this.toggleWallsDisplay();
    }
   );
   toolbarButtonItems.push(toggleWallsButton);
  }
  return toolbarButtonItems;
 }
 async toggleWallsDisplay() {
  const categoriesToHide = [
   "'Wall 2nd'",
   "'Wall 1st'",
   "'Dry Wall 2nd'",
   "'Dry Wall 1st'",
   "'Brick Exterior'",
   "'WINDOWS 1ST'",
   "'WINDOWS 2ND'",
   "'Ceiling 1st'",
   "'Ceiling 2nd'",
   "'Callouts'",
   "'light fixture'",
   "'Roof'",
  ];
  const query = `SELECT ECInstanceId FROM Bis.Category 
       WHERE CodeValue IN (${categoriesToHide.toString()})`;

  const result = IModelApp.viewManager.selectedView?.iModel.query(query);
  const categoryIds = [];
  for await (const row of result!) {
   categoryIds.push(row.id);
  }
  // we want to hide elements which we do not want to display
  IModelApp.viewManager.selectedView?.changeCategoryDisplay(categoryIds, this._toggleWalls); // Enable or disable display of elements belonging to a set
  // of categories specified by Id.
 }

 public provideWidgets(
  stageId: string,
  stageUsage: string,
  location: StagePanelLocation,
  section?: StagePanelSection
 ): ReadonlyArray<AbstractWidgetProps> {
  const widgets: AbstractWidgetProps[] = [];
  if (stageId === "DefaultFrontstage" && location === StagePanelLocation.Right) {
   const backgroundColorWidget: AbstractWidgetProps = {
    id: "BackgroundColorWidget",
    label: "Background Color Toggle",
    getWidgetContent() {
     return (
      <Toggle
       onChange={(toggle) => {
        if (SmartDeviceUiItemsProvider.toggledOnce === false) {
         SmartDeviceUiItemsProvider.originalColor = IModelApp.viewManager.selectedView!.displayStyle.backgroundColor.tbgr;
         SmartDeviceUiItemsProvider.toggledOnce = true;
        }

        const color = toggle ? ColorDef.computeTbgrFromString("skyblue") : SmartDeviceUiItemsProvider.originalColor;
        IModelApp.viewManager.selectedView!.overrideDisplayStyle({
         backgroundColor: color,
        });
       }}
      />
     );
    },
   };

   const widget: AbstractWidgetProps = {
    id: "smartDeviceListWidget", // We should define id to Correctly Save and Restore App Layout
    label: "Smart Devices", // Header of Widget
    getWidgetContent: () => {
     // Gets the widget content
     return <SmartDeviceListWidgetComponent></SmartDeviceListWidgetComponent>;
    },
   };

   const propertiesWidget: AbstractWidgetProps = {
    id: "SmartDevicePropertiesWidget",
    label: "Smart Device Properties",
    getWidgetContent: () => <SmartDeviceProperties></SmartDeviceProperties>,
   };
   const modelViewwidget: AbstractWidgetProps = {
    id: "modelViewWidget", // We should define id to Correctly Save and Restore App Layout
    label: "Model View", // Header of Widget
    getWidgetContent: () => <CameraPath></CameraPath>,
   };

   widgets.push(backgroundColorWidget);
   widgets.push(widget);
   widgets.push(propertiesWidget);
   widgets.push(modelViewwidget);
  }
  return widgets;
 }
}
