import { Point3d } from "@bentley/geometry-core";
import { ColorDef } from "@bentley/imodeljs-common";
import { BeButtonEvent, DynamicsContext, EventHandled, IModelApp, PrimitiveTool, Viewport } from "@bentley/imodeljs-frontend";

export class LineStringDrawTool extends PrimitiveTool {
 public static toolId = "LineStringDrawTool";

 public readonly points: Point3d[] = [];

 public async onPostInstall() {
  await super.onPostInstall();
  if (!this.isDynamicsStarted) this.beginDynamics(); // Start dynamics so that onDynamicFrame will be called
  this.setupAndPromptForNextAction();
  IModelApp.toolAdmin.setCursor(IModelApp.viewManager.crossHairCursor); // For "+" Type Cursor
 }

 setupAndPromptForNextAction() {
  IModelApp.accuSnap.enableSnap(true);
 }

 isCompatibleViewport(vp: Viewport) {
  return undefined !== vp && vp.view.isSpatialView();
 }

 //  Called Always even on Mouse Move on  Viewport
 public onDynamicFrame(ev: BeButtonEvent, context: DynamicsContext) {
  if (this.points.length < 1) return;

  const tmpPoints = this.points.slice(); // Create shallow copy of accepted points
  tmpPoints.push(ev.point.clone()); // Include current cursor location

  const builder = context.createSceneGraphicBuilder();
  builder.setSymbology(ColorDef.black, ColorDef.black, 5);
  builder.addLineString(tmpPoints);
  context.addGraphic(builder.finish()); // Show linestring in view
 }

 //  Called Always even on Mouse Move on  Viewport , OnClick isButtonEvent will be true
 public isValidLocation(ev: BeButtonEvent, isButtonEvent: boolean): boolean {
  return true;
 }
 public onRestartTool() {
  this.setupAndPromptForNextAction();
 }

 public async onDataButtonDown(ev: BeButtonEvent) {
  this.points.push(ev.point.clone()); // Accumulate accepted points, ev.point has been adjusted by AccuSnap and locks

  this.setupAndPromptForNextAction();
  return EventHandled.No;
 }

 public async onResetButtonDown(_ev: BeButtonEvent) {
  return EventHandled.Yes;
 }
}
