import { DisplayStyleSettingsProps, RenderMode } from "@bentley/imodeljs-common";
import { IModelApp, IModelConnection, ScreenViewport } from "@bentley/imodeljs-frontend";
import { SmartDeviceDecorator } from "components/decorators/SmartDeviceDecorator";

// Start Coding from Here after the iModel is Connected
const onIModelConnected = (_imodel: IModelConnection) => {
 // ImodelApp : Global singleton that connects the user interface with the iModel.js services. There can be only one IModelApp active in a session.
 // All members of IModelApp are static, and it serves as a singleton object for gaining access to session information.
 // ViewManager :Class to interact with the viewPort. If We want to add stuffs like markers, Decoraters to ViewPoert or modify things with viewState, ten use this Class
 IModelApp.viewManager.onViewOpen.addOnce(async (vp: ScreenViewport) => {
  // addOnce : Registers a callback function to be executed only once when the event is raised.

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

  const result = vp.iModel.query(query);
  const categoryIds = [];

  for await (const row of result) {
   categoryIds.push(row.id);
  }
  // we want to hide elements which we do not want to display
  vp.changeCategoryDisplay(categoryIds, false); // Enable or disable display of elements belonging to a set of categories specified by Id.

  // View Attributes : to redefine our viewPort and Model Visualisation
  const viewStyle: DisplayStyleSettingsProps = {
   viewflags: {
    renderMode: RenderMode.SmoothShade,
    visEdges: false,
    shadows: true,
   },
  };
  // Selectively override aspects of this viewport's display style.
  vp.overrideDisplayStyle(viewStyle);
  // The process of creating View Decorations starts by adding an object that implements the Decorator interface to the ViewManager via the
  // ViewManager.addDecorator method
  IModelApp.viewManager.addDecorator(new SmartDeviceDecorator(vp));
 });
};

export default onIModelConnected;
