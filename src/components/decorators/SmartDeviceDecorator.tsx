import { Angle, AngleSweep, Arc3d, Box, BSplineCurve3d, Cone, LinearSweep, LineString3d, Loop, Point3d, Sphere, TorusPipe, Vector3d } from "@bentley/geometry-core";
import { ColorDef, LinePixels } from "@bentley/imodeljs-common";
import { DecorateContext, Decorator, GraphicType, IModelConnection, Marker, ScreenViewport } from "@bentley/imodeljs-frontend";
import { StateManager } from "@bentley/ui-framework";
import { SmartDeviceMarker } from "components/markers/SmartDeviceMarker";

// Decorator :Interface for drawing [[Decorations]] into, or on top of, the active [[ScreenViewport]]s managed by [[ViewManager]].
// The Decorator interface just defines the types and functionalities for Graphics that we wil render in the ViewPort
// We will attach  Decorators to  Multiple  Elements
export class SmartDeviceDecorator implements Decorator {
 private _iModel: IModelConnection;
 private pointsData: Point3d[] = [];
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
   this.pointsData.push(new Point3d(value.origin.x, value.origin.y, value.origin.z));
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
  if (StateManager.store.getState().appState.showGeometryDecorator) {
   const overlayBuilder = context.createGraphicBuilder(GraphicType.Scene);
   const polylineColor = ColorDef.from(24.99, 210.885, 208.08);
   overlayBuilder.setSymbology(polylineColor, polylineColor, 10, LinePixels.Code3);

   overlayBuilder.addLineString(this.pointsData);
   if (this.pointsData.length >= 1) {
    overlayBuilder.addArc(Arc3d.createXY(new Point3d(3.7777, 2.97, 4.7783), 0.5), false, true);

    overlayBuilder.addArc(Arc3d.create(new Point3d(0.26, 1.2065, 2.7783), new Vector3d(0.4, 0, 0), new Vector3d(0, 0, 0.4), AngleSweep.createStartEndDegrees(0, 360)), false, true);
    overlayBuilder.addCurvePrimitive(BSplineCurve3d.create([new Point3d(0, 0, 0), new Point3d(4, 0, 0), new Point3d(4, 4, 0), new Point3d(0, 4, 0)], [0, 0, 0, 0, 1, 1, 1, 1], 4)!);
   }

   overlayBuilder.addSolidPrimitive(Sphere.createCenterRadius(new Point3d(6, 1, 16), 1));

   overlayBuilder.addSolidPrimitive(Cone.createAxisPoints(new Point3d(12, 1, 16), new Point3d(9, 2, 16), 0.5, 1, true)!);

   overlayBuilder.addSolidPrimitive(Box.createDgnBox(new Point3d(-1, 1, 16), new Vector3d(1, 0, 0), new Vector3d(0, 1, 0), new Point3d(-1, 1, 20), 4, 4, 4, 4, true)!);

   overlayBuilder.addSolidPrimitive(
    TorusPipe.createAlongArc(Arc3d.createXY(new Point3d(-12, 0, 0 /*innerRadius*/), 4 /*outerRadius*/, AngleSweep.create(Angle.createDegrees(360))), 2 /*innerRadius*/, false)!
   );

   overlayBuilder.addSolidPrimitive(
    LinearSweep.create(
     Loop.create(
      LineString3d.create([
       new Point3d(2, 0, 0),
       new Point3d(1.5, 0.8660254037844386, 0),
       new Point3d(0.5, 0.8660254037844387, 0),
       new Point3d(0, 0, 0),
       new Point3d(0.5, -0.8660254037844385, 0),
       new Point3d(1.5, -0.866025403784439, 0),
       new Point3d(2, 0, 0),
      ])
     ),
     new Vector3d(0, 0, 4),
     true
    )!
   );

   context.addDecorationFromBuilder(overlayBuilder);
  } else {
   this._markerSet.forEach((marker) => {
    // Set the position and add this Marker to the supplied DecorateContext, if it's visible. This method should be called from your implementation of
    //  [[Decorator.decorate]]. It will set this Marker's position based on the Viewport from the context, and add this this Marker to the supplied DecorateContext.
    marker.addDecoration(context);
   });
  }
 }
}
