import { LinePixels, ColorDef } from "@bentley/imodeljs-common";
import { IModelApp, EventHandled, GraphicType, DecorateContext, BeButtonEvent, Decorator, PrimitiveTool, DynamicsContext, Marker } from "@bentley/imodeljs-frontend";
import { Point3d, Path, BezierCurve3dH, Point2d, Vector3d } from "@bentley/geometry-core";
import { Viewport } from "@bentley/imodeljs-frontend";

export class WalkPathTool extends PrimitiveTool {
 public static toolId = "ITwinWebApp.WalkPathTool";
 private _path: Path[] = [];
 public animator: any;
 private _positions: Point3d[] = [];
 private _decorates: Decorator[] = [];

 onPostInstall() {
  super.onPostInstall();
  IModelApp.accuSnap.enableSnap(true);
  if (!this.isDynamicsStarted) {
   console.log(1);
   this.beginDynamics();
  }
  IModelApp?.viewManager?.selectedView?.turnCameraOn();
  IModelApp?.viewManager?.selectedView?.synchWithView(false);
 }

 setupAndPromptForNextAction() {
  IModelApp.accuSnap.enableSnap(true);
 }

 isCompatibleViewport(vp: Viewport) {
  return undefined !== vp && vp.view.isSpatialView();
 }

 onDynamicFrame(ev: BeButtonEvent, context: DynamicsContext) {
  if (this._positions.length > 1) {
   const builder = context.createSceneGraphicBuilder();
   builder.setSymbology(ColorDef.from(24.99, 210.885, 208.08), ColorDef.red, 4, LinePixels.Code3);
   builder.addPath(this._path[0]);
   context.addGraphic(builder.finish());
  }
 }

 onCleanup() {
  return EventHandled.No;
 }

 onRestartTool() {}

 async onDataButtonDown(ev: BeButtonEvent) {
  let point: Point3d = new Point3d(ev.point.x, ev.point.y, ev.point.z);
  let marker = new Marker(point, new Point2d(30, 30));
  marker.imageSize = Point2d.create(15, 40);
  let decorate = {
   decorate(context: DecorateContext) {
    marker.addDecoration(context);
   },
  };
  IModelApp.viewManager.addDecorator(decorate);
  this._decorates.push(decorate);
  this._positions.push(point);

  // draw path
  let bezierPoints: any[] = [];
  let controlPoints: Point3d[] = [];
  let bezierLines: BezierCurve3dH[] = [];
  // Calculate the array of control points
  if (this._positions.length >= 3) {
   for (let i = 0; i < this._positions.length - 2; i++) {
    const points = this.calculateControlPoint(this._positions[i], this._positions[i + 1], this._positions[i + 2]);
    if (points) {
     controlPoints = controlPoints.concat(points);
    }
   }
  }
  // Complement the front and back endpoints of the control point array for easy calculation
  controlPoints.unshift(this._positions[0]);
  controlPoints.push(this._positions[this._positions.length - 1]);
  // Take control points and nodes to generate a multi-segment bezier coordinate array
  for (let j = 0; j < this._positions.length - 1; j++) {
   bezierPoints[j] = [this._positions[j], controlPoints.shift(), controlPoints.shift(), this._positions[j + 1]];
  }
  // Create a bezier line
  bezierPoints.forEach((positions) => {
   const bezierLine = BezierCurve3dH.create(positions!);
   if (bezierLine instanceof BezierCurve3dH) bezierLines.push(bezierLine);
  });
  this._path[0] = Path.createArray(bezierLines);
  localStorage.setItem("bezierPoints", JSON.stringify(bezierPoints));
  localStorage.setItem("bezierLines", JSON.stringify(bezierLines));
  return EventHandled.No;
 }

 calculateControlPoint(point1: Point3d, point2: Point3d, point3: Point3d): Point3d[] {
  const pointMid1 = new Point3d((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.z + point2.z) / 2); //第一个中点
  const pointMid2 = new Point3d((point2.x + point3.x) / 2, (point2.y + point3.y) / 2, (point2.z + point3.z) / 2); //第二个中点
  const VecMid = pointMid1.vectorTo(pointMid2);
  const VecFront = pointMid1.vectorTo(point2);
  const VecBack = point2.vectorTo(pointMid2);
  const frontLength = Math.abs(VecFront.dotProduct(VecMid) / VecMid.magnitude());
  const backLength = Math.abs(VecBack.dotProduct(VecMid) / VecMid.magnitude());
  const normalMid: Vector3d | undefined = VecMid.normalize();

  if (normalMid) {
   const front: Vector3d = normalMid?.scale(frontLength);
   const back: Vector3d = normalMid?.scale(backLength);
   let point12 = point2.minus(front);
   let point23 = point2.plus(back);
   return [point12, point23];
  }
  return [];
 }
}

export class WalkRoundPathDecorator implements Decorator {
 public decorate(context: DecorateContext) {
  let bezierPoints = JSON.parse(localStorage.getItem("bezierPoints") || "[]");
  const overlayBuilder = context.createGraphicBuilder(GraphicType.Scene);
  const polylineColor = ColorDef.from(24.99, 210.885, 208.08);
  overlayBuilder.setSymbology(polylineColor, polylineColor, 10, LinePixels.Code3);
  bezierPoints.forEach((points: any) => {
   const list: Point3d[] = [];
   points.forEach((element: any) => {
    const point = new Point3d(element[0], element[1], element[2]);
    list.push(point);
   });
   const bezier = BezierCurve3dH.create(list);
   if (bezier) {
    const path = Path.create(bezier);
    overlayBuilder.addPath(path);
   } else {
    overlayBuilder.addLineString(list);
   }
  });
  context.addDecorationFromBuilder(overlayBuilder);
 }
}
