import { StageUsage, WidgetState } from "@bentley/ui-abstract";
import {
 BackstageAppButton,
 BasicNavigationWidget,
 ConfigurableCreateInfo,
 ContentControl,
 ContentGroup,
 ContentLayoutDef,
 CoreTools,
 Frontstage,
 FrontstageManager,
 FrontstageProps,
 FrontstageProvider,
 IModelViewportControl,
 SignIn,
 StagePanel,
 StagePanelState,
 ToolWidgetComposer,
 UiFramework,
 Widget,
 Zone,
} from "@bentley/ui-framework";
import React from "react";
import { ViewportContentCustom } from "ui-core components/SimpleViewportComponent";
import { CustomModalFrontstage } from "./CustomModalFrontstage";
import { CustomStatusBarWidget } from "./CustomStatusBar";
import { NestedFrontstageProvider } from "./NestedFrontstageProvider";

// This is just a demo to render things in a new Custom FrontStage
class SignInControl extends ContentControl {
 constructor(info: ConfigurableCreateInfo, options: any) {
  super(info, options);

  this.reactNode = (
   <div>
    {options.contructorInjectionData}
    <SignIn onOffline={this._onWorkOffline} onRegister={this._onRegister} />;
   </div>
  );
 }

 // Here We shall just open the Nested FrontStage
 private _onWorkOffline = async () => {
  const nestedFrontstageProvider = new NestedFrontstageProvider();
  const frontstageDef = nestedFrontstageProvider.initializeDef();
  await FrontstageManager.openNestedFrontstage(frontstageDef);
 };

 private _onRegister = () => {
  const modalFrontstage = new CustomModalFrontstage();
  FrontstageManager.openModalFrontstage(modalFrontstage);
 };
}

export class CustomFrontStageProvider extends FrontstageProvider {
 // Content layout for content views
 private _contentLayoutDef: ContentLayoutDef;

 constructor() {
  super();
  // Create the content layouts.
  // https://www.itwinjs.org/learning/ui/framework/contentviews/#three-views-one-on-the-left-two-stacked-on-the-right
  this._contentLayoutDef = new ContentLayoutDef({
   id: "ThreeRightStacked",
   verticalSplit: {
    percentage: 0.5,
    left: 0,
    right: { horizontalSplit: { percentage: 0.5, top: 1, bottom: 2 } },
   },
  });
 }
 // Create the content group.
 contentGroup = new ContentGroup({
  contents: [
   {
    classId: ViewportContentCustom,
    applicationData: {
     // will be injected to constructor of ViewportContentCustom in Options parameter
     iModelConnection: UiFramework.getIModelConnection(), // While passing frontStage as props in iTwinViewer iModelConnection is not initiated , so
     // UiFramework.getIModelConnection is undefined now
     viewId: "0x200000000d2", // We got this viewId by querying the iModel Views (_imodel.views.getViewList({ from: DrawingViewState.classFullName }))
    },
   },

   {
    classId: IModelViewportControl,
    applicationData: {
     iModelConnection: UiFramework.getIModelConnection(),
     viewState: async () => {
      const view = await UiFramework.getIModelConnection()?.views.load("0x200000000d2");
      // While passing frontStage as props in iTwinViewer iModelConnection is not initiated , so
      // UiFramework.getIModelConnection is undefined now , hence view is also undefined  now
      return view;
     },
    },
   },
   {
    classId: SignInControl, //classId?: ConfigurableUiControlConstructor
    // export declare type ConfigurableUiControlConstructor = new (info: ConfigurableCreateInfo, options: any) => ConfigurableUiElement;
    // so, ConfigurableUiControlConstructor actually is an alias for ConfigurableUiElement
    applicationData: {
     // Data We require at the Control is passed using applicationData
     contructorInjectionData: "I love iTwinJs", // will be injected to constructor of SignInControl in Options parameter
    },
   },
  ],
 });

 public get frontstage(): React.ReactElement<FrontstageProps> {
  return (
   <Frontstage
    id="CustomFronstStage"
    defaultTool={CoreTools.selectElementCommand} // Use Arrow Button as Curson by default
    defaultLayout={this._contentLayoutDef} // Content layout for content views
    contentGroup={this.contentGroup} // Display the main React Component
    defaultContentId="singleIModelView" // Optional , can be ignored
    isInFooterMode={true}
    usage={StageUsage.General}
    applicationData={{ key: "value" }} /** Any application data to attach to this Frontstage. */
    // Top Left Vertical
    contentManipulationTools={
     <Zone
      widgets={[
       <Widget isFreeform={true} element={<ToolWidgetComposer cornerItem={<BackstageAppButton />} />} />,
       //  <Widget isFreeform={true} element={<BasicToolWidget />} />, // We can create a Custom BasicToolWidget as done in iTwinViewer code https://www.itwinjs.org/learning/ui/framework/widgets/#tool-widget
      ]}
     />
    }
    toolSettings={<Zone widgets={[<Widget isToolSettings={true} />]} />} // Top
    viewNavigationTools={<Zone widgets={[<Widget isFreeform={true} element={<BasicNavigationWidget />} />]} />} // We can create a Custom BasicVavigationWidget
    // as done in iTwinViewer code https://www.itwinjs.org/learning/ui/framework/widgets/#navigation-widget
    statusBar={<Zone widgets={[<Widget isStatusBar={true} classId={CustomStatusBarWidget} />]} />} //classId?: ConfigurableUiControlConstructor
    leftPanel={
     <StagePanel
      size={300}
      defaultState={StagePanelState.Open}
      panelZones={{
       start: {
        widgets: [
         <Widget
          id="LeftStart1"
          label="Start1"
          defaultState={WidgetState.Open}
          canPopout={true}
          element={<h2>Left Start1 widget</h2>}
         />, // element?: React.ReactNode
         <Widget id="LeftStart2" label="Start2" canPopout={true} element={<h2>Left Start2 widget</h2>} />,
        ],
       },
       middle: {
        widgets: [
         <Widget id="LeftMiddle1" label="Middle1" element={<h2>Left Middle1 widget</h2>} />,
         <Widget id="LeftMiddle2" label="Middle2" defaultState={WidgetState.Open} element={<h2>Left Middle2 widget</h2>} />,
        ],
       },
       end: {
        widgets: [
         <Widget id="LeftEnd1" label="End1" defaultState={WidgetState.Open} element={<h2>Left End1 widget</h2>} />,
         <Widget id="LeftEnd2" label="End2" element={<h2>Left End2 widget</h2>} />,
        ],
       },
      }}
     />
    }
    topPanel={
     <StagePanel
      size={80}
      defaultState={StagePanelState.Minimized}
      panelZones={{
       start: {
        widgets: [
         <Widget id="TopStart1" label="Start1" defaultState={WidgetState.Closed} element={<h2>Top Start1 widget</h2>} />,
         <Widget id="TopStart2" label="Start2" element={<h2>Top Start2 widget</h2>} />,
        ],
       },
       end: {
        widgets: [
         <Widget id="TopEnd1" label="End1" element={<h2>Top End1 widget</h2>} />,
         <Widget id="TopEnd2" label="End2" defaultState={WidgetState.Closed} element={<h2>Top End2 widget</h2>} />,
        ],
       },
      }}
     />
    }
    rightPanel={
     <StagePanel
      defaultState={StagePanelState.Open}
      panelZones={{
       start: {
        widgets: [
         <Widget id="RightStart1" label="Start1" element={<h2>Right Start1 widget</h2>} />,
         <Widget id="RightStart2" label="Start2" defaultState={WidgetState.Open} element={<h2>Right Start2 widget</h2>} />,
        ],
       },
       middle: {
        widgets: [
         <Widget id="RightMiddle1" label="Middle1" defaultState={WidgetState.Open} element={<h2>Right Middle1 widget</h2>} />,
         <Widget id="RightMiddle2" label="Middle2" element={<h2>Right Middle2 widget</h2>} />,
        ],
       },
       end: {
        widgets: [
         <Widget id="RightEnd1" label="End1" element={<h2>Right End1 widget</h2>} />,
         <Widget id="RightEnd2" label="End2" defaultState={WidgetState.Open} element={<h2>Right End2 widget</h2>} />,
        ],
       },
      }}
     />
    }
    bottomPanel={
     <StagePanel
      size={180}
      defaultState={StagePanelState.Open}
      panelZones={{
       start: {
        widgets: [
         <Widget id="BottomStart1" label="Start1" element={<h2>Bottom Start1 widget</h2>} />,
         <Widget id="BottomStart2" label="Start2" defaultState={WidgetState.Open} element={<h2>Bottom Start2 widget</h2>} />,
        ],
       },
       end: {
        widgets: [
         <Widget id="BottomEnd1" label="End1" defaultState={WidgetState.Open} element={<h2>Bottom End1 widget</h2>} />,
         <Widget id="BottomEnd2" label="End2" element={<h2>Bottom End2 widget</h2>} />,
        ],
       },
      }}
     />
    }
   />
  );
 }
}
