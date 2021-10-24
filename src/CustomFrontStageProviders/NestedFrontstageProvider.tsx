import {
 ContentGroup,
 ContentLayoutDef,
 CoreTools,
 Frontstage,
 FrontstageProps,
 FrontstageProvider,
 NestedFrontstage,
 ToolWidget,
 Widget,
 Zone,
} from "@bentley/ui-framework";
import React from "react";

// https://www.itwinjs.org/learning/ui/framework/nestedfrontstage/
export class NestedFrontstageProvider extends FrontstageProvider {
 // Content layout for content views
 private _contentLayoutDef: ContentLayoutDef;

 constructor() {
  super();
  // Create the content layouts.
  // https://www.itwinjs.org/learning/ui/framework/contentviews/#three-views-one-on-the-left-two-stacked-on-the-right
  this._contentLayoutDef = new ContentLayoutDef({});
 }
 // Create the content group.
 contentGroup = new ContentGroup({
  contents: [],
 });
 public get frontstage(): React.ReactElement<FrontstageProps> {
  return (
   <Frontstage
    id="NestedFrontstageProvider"
    defaultTool={CoreTools.selectElementCommand}
    defaultLayout={this._contentLayoutDef}
    contentGroup={this.contentGroup}
    isInFooterMode={true}
    applicationData={{ key: "value" }} /** Any application data to attach to this Frontstage. */
    // Top Left Vertical
    contentManipulationTools={
     <Zone
      widgets={[
       <Widget isFreeform={true} element={<ToolWidget appButton={NestedFrontstage.backToPreviousFrontstageCommand} />} />,
       // only use ToolWidget , because the back button is not supported by ToolWidgetComposer
      ]}
     />
    }
   />
  );
 }
}
