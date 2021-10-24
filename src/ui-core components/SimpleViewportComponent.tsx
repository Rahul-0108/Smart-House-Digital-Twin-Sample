import * as React from "react";
import { ViewportComponent } from "@bentley/ui-components";
import { ScreenViewport } from "@bentley/imodeljs-frontend";
import { ConfigurableCreateInfo, UiFramework, ViewportContentControl } from "@bentley/ui-framework";

/** Viewport component for the viewer app */

/**
 * iModel Viewport content
 */
export class ViewportContentCustom extends ViewportContentControl {
 constructor(info: ConfigurableCreateInfo, options: any) {
  super(info, options);
  if (!options.iModelConnection) {
   options.iModelConnection = UiFramework.getIModelConnection(); // since We are using iTwinViewer and while passing FrontStages in props iModelConnection was not
   // initiated so options.iModelConnection is undefined now , at runtime We will have iModelConnection using UiFramewor.IModelConnection at this Component hence here
   // we check and populate its value
  }

  if (options.iModelConnection && options.viewId) {
   this.reactNode = (
    <ViewportComponent
     viewportRef={(v: ScreenViewport) => {
      this.viewport = v;
     }}
     imodel={options.iModelConnection}
     viewDefinitionId={options.viewId}
    />
   );
  }
 }
}
