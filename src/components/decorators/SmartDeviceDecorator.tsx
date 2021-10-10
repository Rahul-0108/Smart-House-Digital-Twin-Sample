import { DecorateContext, Decorator, IModelConnection, Marker, ScreenViewport } from "@bentley/imodeljs-frontend";
import { SmartDeviceMarker } from "components/markers/SmartDeviceMarker";

// Decorator :Interface for drawing [[Decorations]] into, or on top of, the active [[ScreenViewport]]s managed by [[ViewManager]].
// The Decorator interface just defines the types and functionalities for Graphics that we wil render in the ViewPort
// We will attach  Decorators to  Multiple  Elements
export class SmartDeviceDecorator implements Decorator {
 private _iModel: IModelConnection;
 // A Marker is a [[CanvasDecoration]], whose position follows a fixed location in world space. Markers draw on top of all scene graphics,
 // and show visual cues about locations of interest.
 private _markerSet: Marker[]; // For our case , We will be using HTML Element as a Marker

 constructor(vp: ScreenViewport) {
  this._iModel = vp.iModel;
  this._markerSet = [];

  this.addMarkers();
 }

 private async getSmartDeviceData() {
  const query = `
      SELECT EcInstanceId,SmartDeviceId,SmartDeviceType,
              Origin
              FROM DgnCustomItemTypes_HouseSchema.SmartDevice
              WHERE Origin IS NOT NULL
    `;
  const results = this._iModel.query(query);
  const values = [];
  for await (const row of results) {
   values.push(row);
  }
  return values;
 }

 private async addMarkers() {
  const values = await this.getSmartDeviceData();
  const response = await fetch("https://smarthomedata.z22.web.core.windows.net/");
  const cloudData = await response.json();

  values.forEach((value) => {
   const smartDeviceMarker = new SmartDeviceMarker(
    { x: value.origin.x, y: value.origin.y, z: value.origin.z },
    { x: 40, y: 40 },
    value.smartDeviceId,
    value.smartDeviceType,
    cloudData[value.smartDeviceId],
    value.id
   );

   this._markerSet.push(smartDeviceMarker);
  });
 }

 // Implement this method to add [[Decorations]] into the supplied DecorateContext.
 public decorate(context: DecorateContext): void {
  this._markerSet.forEach((marker) => {
   // Set the position and add this Marker to the supplied DecorateContext, if it's visible. This method should be called from your implementation of
   //  [[Decorator.decorate]]. It will set this Marker's position based on the Viewport from the context, and add this this Marker to the supplied DecorateContext.
   marker.addDecoration(context);
  });
 }
}
