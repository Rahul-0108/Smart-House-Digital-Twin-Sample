import { DisplayStyleSettingsProps, RenderMode } from "@bentley/imodeljs-common";
import { IModelApp, IModelConnection, ScreenViewport } from "@bentley/imodeljs-frontend";
import { UiItemsArbiter } from "@bentley/ui-abstract";
import { PinDecorator } from "components/decorators/PinDecorator";
import { SmartDeviceDecorator } from "components/decorators/SmartDeviceDecorator";
import { ProductSettingsService } from "iTwin Cloud Services/ProductSettingsService";
import { ExampleUiItemsApplication } from "providers/ExampleUiItemsApplication";
import { registerReducers } from "Redux/Reducer";
import { PlacePin } from "Tools/PlacePin";
import { showMenu } from "ui-core components/Menu";
import { showToolbar } from "ui-core components/Toolbar";

// Start Coding from Here after the iModel is Connected
const onIModelConnected = async (_imodel: IModelConnection) => {
 // https://www.itwinjs.org/learning/ui/abstract/uiitemsprovider/#uiitemsarbiter
 UiItemsArbiter.uiItemsApplication = new ExampleUiItemsApplication();
 await ProductSettingsService.Initialize();

 registerReducers(); // Register dynamic Reducers

 const registeredNamespace = IModelApp.i18n.registerNamespace("Camera"); // To show how to register a namespace
 await registeredNamespace.readFinished;

 // ImodelApp : Global singleton that connects the user interface with the iModel.js services. There can be only one IModelApp active in a session.
 // All members of IModelApp are static, and it serves as a singleton object for gaining access to session information.
 // ViewManager :Class to interact with the viewPort. If We want to add stuffs like markers, Decoraters to ViewPoert or modify things with viewState, ten use this Class
 IModelApp.viewManager.onViewOpen.addOnce(async (vp: ScreenViewport) => {
  // addOnce : Registers a callback function to be executed only once when the event is raised.

  let categoriesToHide = [];
  const categoriesJsonBag = await ProductSettingsService.getSharedSetting(
   "spa-3ZbQOKSVnH4Zo2sFdzwDlEMPI",
   "iModelCategoriesToHideSettings",
   true,
   process.env.IMJS_CONTEXT_ID!,
   process.env.IMJS_IMODEL_ID
  );

  if (categoriesJsonBag && categoriesJsonBag.setting) {
   categoriesToHide = JSON.parse(categoriesJsonBag.setting);
  } else {
   categoriesToHide = [
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
   await ProductSettingsService.saveSharedSetting(
    JSON.stringify(categoriesToHide),
    "spa-3ZbQOKSVnH4Zo2sFdzwDlEMPI",
    "iModelCategoriesToHideSettings",
    true,
    process.env.IMJS_CONTEXT_ID!,
    process.env.IMJS_IMODEL_ID
   );
  }

  const query = `SELECT ECInstanceId FROM Bis.Category 
      WHERE CodeValue IN (${categoriesToHide.toString()})`;

  const result = vp.iModel.query(query);
  let categoryIds = [];
  for await (const row of result) {
   categoryIds.push(row.id);
  }
  // we want to hide elements which we do not want to display
  vp.changeCategoryDisplay(categoryIds, false); // Enable or disable display of elements belonging to a set of categories specified by Id.

  let renderMode: RenderMode | undefined;
  const renderModeSettings = await ProductSettingsService.getSetting(
   "spa-3ZbQOKSVnH4Zo2sFdzwDlEMPI",
   "iModelRenderModeSettings",
   true,
   process.env.IMJS_CONTEXT_ID!,
   process.env.IMJS_IMODEL_ID
  );

  if (renderModeSettings && renderModeSettings?.setting) {
   renderMode = Number(renderModeSettings.setting);
  } else {
   renderMode = RenderMode.SmoothShade;
   await ProductSettingsService.saveSetting(
    renderMode.toString(),
    "spa-3ZbQOKSVnH4Zo2sFdzwDlEMPI",
    "iModelRenderModeSettings",
    true,
    process.env.IMJS_CONTEXT_ID!,
    process.env.IMJS_IMODEL_ID
   );
  }

  // View Attributes : to redefine our viewPort and Model Visualisation
  const viewStyle: DisplayStyleSettingsProps = {
   viewflags: {
    renderMode,
    visEdges: false,
    shadows: true,
   },
  };
  // Selectively override aspects of this viewport's display style.
  vp.overrideDisplayStyle(viewStyle);
  // The process of creating View Decorations starts by adding an object that implements the Decorator interface to the ViewManager via the
  // ViewManager.addDecorator method
  IModelApp.viewManager.addDecorator(new SmartDeviceDecorator(vp));

  PlacePin.namespace = IModelApp.i18n.registerNamespace("Camera");
  IModelApp.tools.register(PlacePin);

  IModelApp.viewManager.addDecorator(new PinDecorator());

  showMenu();
  showToolbar();
 });
};

export default onIModelConnected;
