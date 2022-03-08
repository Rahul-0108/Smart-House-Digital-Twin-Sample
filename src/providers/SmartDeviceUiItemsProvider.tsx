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
 BadgeType,
 UiItemsApplicationAction,
 CommonStatusBarItem,
 StatusBarSection,
 AbstractZoneLocation,
 ConditionalStringValue,
} from "@bentley/ui-abstract";
import { Toggle } from "@bentley/ui-core";
import React from "react";
import CameraView from "./CameraView";
import { SmartDeviceProperties } from "./SmartDeviceProperties";
import { SmartDeviceListWidgetComponent } from "./SmartDeviceListWidgetComponent";
import { FooterModeField, StateManager, StatusBarItem, StatusBarItemUtilities, SyncUiEventId, UiFramework, WidgetState, withStatusFieldProps } from "@bentley/ui-framework";
import { FooterSeparator } from "@bentley/ui-ninezone";
import { AppActionId } from "Redux/Action";
import { AppState } from "Redux/Reducer";
import { Point3d } from "@bentley/geometry-core";
import { MarkerPinsListWidget } from "./MarkerPinsListWidget";
import { PlacePin } from "Tools/PlacePin";
import { LineStringDrawTool } from "Tools/LineStringDrawTool";
import { SampleLocateTool } from "Tools/AccuSnapToolExamples";
import { IModelContentTree } from "Tree/IModelContentTree";
import { TableCustomUnifiedSelection } from "Table_propertypane/TableCustomUnifiedSelection";

export class SmartDeviceUiItemsProvider implements UiItemsProvider {
 public readonly id = "SmartDeviceUiProvider";
 private _toggleWalls: boolean = false;
 private static toggledOnce: boolean = false;
 private static originalColor: number;
 private icons = ["icon-developer", "icon-element"];
 private iconIndex = 1;

 //Below is the UiItemsProvider function called when ui-framework is populating toolbars. The ToolbarUsage will indicate if the toolbar
 //is on the left (content manipulation) or right (view navigation) of the application window. The ToolbarOrientation specifies if the toolbar
 //is horizontal or vertical.
 public provideToolbarButtonItems(stageId: string, stageUsage: string, toolbarUsage: ToolbarUsage, toolbarOrientation: ToolbarOrientation): CommonToolbarItem[] {
  const toolbarButtonItems: CommonToolbarItem[] = [];

  if (
   // Make sure We Add the New ToolBar  Button at the right Place
   stageId === "DefaultFrontstage" &&
   stageUsage === StageUsage.General && // We will attach the Button to the General  Stage Area The Default  Stage
   toolbarUsage === ToolbarUsage.ContentManipulation &&
   toolbarOrientation === ToolbarOrientation.Vertical
  ) {
   const toggleWallsButton = ToolbarItemUtilities.createActionButton(
    "ToggleWalls",
    1000, // We want to add out new Tool Button at Bottom , so using itemPriority at maximum
    new ConditionalStringValue(() => {
     this.iconIndex = this.iconIndex === 1 ? 0 : 1;
     return this.iconIndex === 1 ? "icon-element" : "icon-developer";
    }, [SyncUiEventId.SelectionSetChanged]), // @bentley/iconsgeneric has a lot of icons, so We will use one from it,We Need to prefix with "icon-"
    "Toggle Walls Tool", // For  ToolTip
    () => {
     const childWindowId = "popout-widget-1";
     const title = "Example Popout Widget";
     const content = <div>Example Popout Widget</div>;
     const location = { height: 600, width: 400, left: 10, top: 50 };
     const useDefaultPopoutUrl = false; // this is default if not specified
     UiFramework.childWindowManager.openChildWindow(childWindowId, title, content, location, true);
     // Action on Click
     this._toggleWalls = !this._toggleWalls;
     this.toggleWallsDisplay();
    }
   );
   toolbarButtonItems.push(toggleWallsButton);

   const geometryDecoratorShow = ToolbarItemUtilities.createActionButton(
    "GeometryDecorator",
    1100, // We want to add out new Tool Button at Bottom , so using itemPriority at maximum
    "icon-element", // @bentley/iconsgeneric has a lot of icons, so We will use one from it,We Need to prefix with "icon-"
    "GeometryDecorator", // For  ToolTip
    () => {
     IModelApp.viewManager.selectedView?.invalidateDecorations();

     UiFramework.dispatchActionToStore(AppActionId.set_Show_Geometry_Decorator, !StateManager.store.getState().appState.showGeometryDecorator);
    }
   );
   toolbarButtonItems.push(geometryDecoratorShow);

   const PlacementMarker = ToolbarItemUtilities.createActionButton(
    "Placement Marker",
    1200, // We want to add out new Tool Button at Bottom , so using itemPriority at maximum
    "icon-map", // @bentley/iconsgeneric has a lot of icons, so We will use one from it,We Need to prefix with "icon-"  https://unpkg.com/@bentley/icons-generic-webfont@1.0.34/dist/bentley-icons-generic-webfont.html
    "Placement Marker", // For  ToolTip
    () => {
     IModelApp.tools.run(
      PlacePin.toolId,
      () => (StateManager.store.getState().appState as AppState).pinLocations,
      (pins: Point3d[]) => UiFramework.dispatchActionToStore(AppActionId.set_Pin_Locations, pins)
     );
    }
   );
   toolbarButtonItems.push(PlacementMarker);

   const drawLineStringToolButton = ToolbarItemUtilities.createActionButton(
    "DrawLineStringTool",
    1400, // We want to add out new Tool Button at Bottom , so using itemPriority at maximum
    "icon-draw", // @bentley/iconsgeneric has a lot of icons, so We will use one from it,We Need to prefix with "icon-"  https://unpkg.com/@bentley/icons-generic-webfont@1.0.34/dist/bentley-icons-generic-webfont.html
    "Draw LineString Tool", // For  ToolTip
    () => IModelApp.tools.run(LineStringDrawTool.toolId)
   );

   toolbarButtonItems.push(drawLineStringToolButton);

   const sampleLocateToolButton = ToolbarItemUtilities.createActionButton(
    "SampleLocateToolButton",
    1400, // We want to add out new Tool Button at Bottom , so using itemPriority at maximum
    "icon-select-plus", // @bentley/iconsgeneric has a lot of icons, so We will use one from it,We Need to prefix with "icon-"  https://unpkg.com/@bentley/icons-generic-webfont@1.0.34/dist/bentley-icons-generic-webfont.html
    "Sample Locate Tool", // For  ToolTip
    () => IModelApp.tools.run(SampleLocateTool.toolId)
   );

   toolbarButtonItems.push(sampleLocateToolButton);

   // *********************************GROUP BUTTON DEMO *************************************************
   const actionButtonTest = ToolbarItemUtilities.createActionButton("actionButtonTest test", 2200, "icon-developer", "ActionButtonTest", (): void => {
    console.log("Got Here!");
   });
   const groupButton = ToolbarItemUtilities.createGroupButton("test-tool-group", 2400, "icon-developer", "test group", [toggleWallsButton, actionButtonTest], {
    badgeType: BadgeType.New,
   });
   toolbarButtonItems.push(groupButton);
   // *********************************GROUP BUTTON DEMO *************************************************
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
  section?: StagePanelSection,
  zoneLocation?: AbstractZoneLocation
 ): ReadonlyArray<AbstractWidgetProps> {
  const widgets: AbstractWidgetProps[] = [];
  if (stageId === "DefaultFrontstage" && location === StagePanelLocation.Right && section === StagePanelSection.Start) {
   const backgroundColorWidget: AbstractWidgetProps = {
    id: "BackgroundColorWidget",
    label: "Background Color Toggle",
    getWidgetContent() {
     return (
      <div>
       <Toggle
        title={"Toggle"}
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
       <p>
        Demos changing widgetState and toggle wall icon using consitionalStringValue using SyncEventIds. On selectionchange of elements in viewport the widget state changes and
        also the toggle wall icon
       </p>
      </div>
     );
    },
    syncEventIds: [SyncUiEventId.SelectionSetChanged], // Defines the SyncUi event Ids that will trigger the stateFunc to run to determine the state of the widget.
    stateFunc: (state: Readonly<WidgetState>) => {
     // Function executed to determine the state of the widget.
     if (state !== WidgetState.Hidden) {
      // here Open state means Active Widget , hidden means remove the widget , closed means not the hide the contents of the widget
      return WidgetState.Hidden;
     } else {
      return WidgetState.Open;
     }
    },
   };

   const treesWidget: AbstractWidgetProps = {
    id: "treesWidget",
    label: "Tree Widget",
    getWidgetContent: () => <IModelContentTree iModel={UiFramework.getIModelConnection()!}></IModelContentTree>,
   };

   const markersWidget: AbstractWidgetProps = {
    id: "markersWidget",
    label: "Markers Widget",
    getWidgetContent: () => <MarkerPinsListWidget></MarkerPinsListWidget>,
    syncEventIds: [AppActionId.set_Pin_Locations], // Defines the SyncUi event Ids that will trigger the stateFunc to run to determine the state of the widget.
    stateFunc: (state: Readonly<WidgetState>) => {
     // Function executed to determine the state of the widget
     return WidgetState.Open;
    },
   };

   const widget: AbstractWidgetProps = {
    id: "smartDeviceListWidget", // We should define id to Correctly Save and Restore App Layout
    label: IModelApp.i18n.translate("Widgets:widgets.smartDevices"), // Header of Widget
    getWidgetContent: () => {
     // Gets the widget content
     return <SmartDeviceListWidgetComponent></SmartDeviceListWidgetComponent>;
    },
   };

   const tableWidget: AbstractWidgetProps = {
    id: "tableWidget", // We should define id to Correctly Save and Restore App Layout
    label: "TableWidget", // Header of Widget
    getWidgetContent: () => {
     // Gets the widget content
     return <TableCustomUnifiedSelection imodel={UiFramework.getIModelConnection()!}></TableCustomUnifiedSelection>;
    },
   };

   const propertiesWidget: AbstractWidgetProps = {
    id: "SmartDevicePropertiesWidget",
    label: "Smart Device Properties",
    getWidgetContent: () => <SmartDeviceProperties></SmartDeviceProperties>,
    syncEventIds: [AppActionId.set_Selected_SmartDevice_Element],
    stateFunc: (state: Readonly<WidgetState>) => {
     return WidgetState.Open; // We will Open the Smart Device Properties tab once a Smart Device is clicked and Selected , Here Redux Action is used for SyncUiEvent
    },
   };

   widgets.push(treesWidget);
   widgets.push(backgroundColorWidget);
   widgets.push(markersWidget);
   widgets.push(tableWidget);
   widgets.push(widget);
   widgets.push(propertiesWidget);
  } else if (stageId === "DefaultFrontstage" && location === StagePanelLocation.Right && section === StagePanelSection.End) {
   const modelViewwidget: AbstractWidgetProps = {
    id: "modelViewWidget", // We should define id to Correctly Save and Restore App Layout
    label: "Model View", // Header of Widget
    getWidgetContent: () => <CameraView></CameraView>,
   };
   widgets.push(modelViewwidget);
  }
  return widgets;
 }

 public provideStatusBarItems(stageId: string, stageUsage: string): CommonStatusBarItem[] {
  const statusBarItems: StatusBarItem[] = [];
  if (stageId === "DefaultFrontstage" && stageUsage === StageUsage.General) {
   statusBarItems.push(
    StatusBarItemUtilities.createStatusBarItem(
     "ToggleTest",
     StatusBarSection.Left,
     100,
     <Toggle
      title={"Toggle"}
      style={{ marginLeft: "8px", marginRight: "8px" }}
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
    )
   );
   const FooterOnlyDisplay = withStatusFieldProps(FooterModeField);
   statusBarItems.push(
    StatusBarItemUtilities.createStatusBarItem(
     "PreToolAssistance",
     StatusBarSection.Left,
     110,
     <FooterOnlyDisplay>
      <FooterSeparator />
     </FooterOnlyDisplay>
    )
   );
  }
  return statusBarItems;
 }

 /** Called if the application changed the Toolbar button item */
 public onToolbarButtonItemArbiterChange(item: CommonToolbarItem, action: UiItemsApplicationAction) {
  console.log(`${item.label} is ${action}`);
 }
}
