/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";

import { FitViewTool, IModelApp, ScreenViewport, StandardViewId } from "@bentley/imodeljs-frontend";
import { Viewer } from "@itwin/web-viewer-react";
import React, { useContext } from "react";

import ViewerContext from "./ViewerContext";
import { ColorTheme } from "@bentley/ui-framework";
import onIModelConnected from "./onIModelConnected";
import { SmartDeviceUiItemsProvider } from "providers/SmartDeviceUiItemsProvider";
import { CustomFrontStageProvider } from "CustomFrontStageProviders/CustomFrontStageProvider";
import { CustomBackstageProvider } from "CustomFrontStageProviders/CustomBackstageProvider";
import { BentleyCloudRpcManager, BentleyCloudRpcParams, IModelReadRpcInterface, IModelTileRpcInterface, RpcInterfaceDefinition } from "@bentley/imodeljs-common";
import { ITwinHelper } from "ITwinHelper";
import { PresentationRpcInterface } from "@bentley/presentation-common";
import { CategoriesQueriesRpcInterface } from "common/Rpc";
interface ViewerStartupProps {
 onIModelAppInit: () => void;
}

const ViewerStartup: React.FC<ViewerStartupProps> = (props: ViewerStartupProps) => {
 const { contextId, iModelId, authOptions } = useContext(ViewerContext);

 /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
  * This will provide an "optimal" view of the model. However, it will override any default views that are
  * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
  * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
  */
 const viewConfiguration = (viewPort: ScreenViewport) => {
  const tileTreesLoaded = () => {
   return new Promise((resolve, reject) => {
    const start = new Date();
    const intvl = setInterval(() => {
     if (viewPort.areAllTileTreesLoaded) {
      clearInterval(intvl);
      resolve(true);
     }
     const now = new Date();
     // after 20 seconds, stop waiting and fit the view
     if (now.getTime() - start.getTime() > 20000) {
      reject();
     }
    }, 100);
   });
  };
  tileTreesLoaded().finally(() => {
   IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
   viewPort.view.setStandardRotation(StandardViewId.Iso);
  });
 };

 return (
  <Viewer
   contextId={contextId}
   iModelId={iModelId}
   authConfig={authOptions}
   theme={ColorTheme.Light}
   viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
   onIModelConnected={onIModelConnected}
   onIModelAppInit={props.onIModelAppInit}
   uiProviders={[new SmartDeviceUiItemsProvider()]} // We  Need to Register thr Provider to  The  Viewer
   additionalI18nNamespaces={["Widgets"]} // Register localization files on Start
   frontstages={[{ provider: new CustomFrontStageProvider() /*,default: true*/, requiresIModelConnection: true }]} // new Custom FrontStage
   backstageItems={CustomBackstageProvider()}
   backend={
    ITwinHelper.isCustomBackend
     ? { customBackend: { rpcParams: { info: { title: "itwinViewerCustomBackend", version: "v1.0" }, uriPrefix: "http://localhost:3001" } as BentleyCloudRpcParams } }
     : undefined
   }
   additionalRpcInterfaces={[CategoriesQueriesRpcInterface]}
  />
 );
};

// A single frontend can consume RpcInterfaces from multiple sources, including the app's own backend, if any, and remote services. The frontend must group interfaces
// according to the backend that provides them and then use the appropriate configuration for each.
export function initializeRpcClientBentleyCloud() {
 /** Initializes BentleyCloudRpcManager for the frontend of an application. */
 BentleyCloudRpcManager.initializeClient({ info: { title: "itwinViewerCustomBackend", version: "v1.0" }, uriPrefix: "http://localhost:3001" } as BentleyCloudRpcParams, [
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  PresentationRpcInterface,
  CategoriesQueriesRpcInterface,
 ]);
}

export default ViewerStartup;
