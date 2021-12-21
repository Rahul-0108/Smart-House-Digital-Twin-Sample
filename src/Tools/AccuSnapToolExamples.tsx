/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Point3d, Vector3d } from "@bentley/geometry-core";
import { ColorDef } from "@bentley/imodeljs-common";
import {
 AccuDrawHintBuilder,
 BeButtonEvent,
 DynamicsContext,
 EventHandled,
 HitDetail,
 IModelApp,
 LocateFilterStatus,
 LocateResponse,
 PrimitiveTool,
} from "@bentley/imodeljs-frontend";

export class SampleSnapTool extends PrimitiveTool {
 public static toolId = "Sample.Snap";
 // __PUBLISH_EXTRACT_START__ PrimitiveTool_Snap
 public readonly points: Point3d[] = [];

 public onDynamicFrame(ev: BeButtonEvent, context: DynamicsContext): void {
  if (this.points.length < 1) return;

  const tmpPoints = this.points.slice(); // Create shallow copy of accepted points
  tmpPoints.push(ev.point.clone()); // Include current cursor location

  const builder = context.createSceneGraphicBuilder();
  builder.setSymbology(context.viewport.getContrastToBackgroundColor(), ColorDef.black, 1);
  builder.addLineString(tmpPoints);
  context.addGraphic(builder.finish()); // Show linestring in view
 }

 public async onDataButtonDown(ev: BeButtonEvent): Promise<EventHandled> {
  this.points.push(ev.point.clone()); // Accumulate accepted points, ev.point has been adjusted by AccuSnap and locks

  if (!this.isDynamicsStarted) this.beginDynamics(); // Start dynamics on first data button so that onDynamicFrame will be called

  return EventHandled.No;
 }

 public async onPostInstall() {
  await super.onPostInstall();
  IModelApp.accuSnap.enableSnap(true); // Enable AccuSnap so that linestring can be created by snapping to existing geometry
 }
 // __PUBLISH_EXTRACT_END__

 public async onRestartTool() {
  return this.exitTool();
 }
}

export class SampleLocateTool extends PrimitiveTool {
 public static toolId = "Sample.Locate";
 public async onRestartTool() {
  return this.exitTool();
 }

 // __PUBLISH_EXTRACT_START__ PrimitiveTool_Locate
 public async filterHit(hit: HitDetail, _out?: LocateResponse): Promise<LocateFilterStatus> {
  // Check that element is valid for the tool operation, ex. query backend to test class, etc.
  // For this example we'll just test the element's selected status.
  const isSelected = this.iModel.selectionSet.has(hit.sourceId);
  return isSelected ? LocateFilterStatus.Reject : LocateFilterStatus.Accept; // Reject element that is already selected
 }

 public async onDataButtonDown(ev: BeButtonEvent): Promise<EventHandled> {
  const hit = await IModelApp.locateManager.doLocate(new LocateResponse(), true, ev.point, ev.viewport, ev.inputSource);
  if (hit !== undefined) this.iModel.selectionSet.replace(hit.sourceId); // Replace current selection set with accepted element

  return EventHandled.No;
 }

 public async onPostInstall() {
  await super.onPostInstall();
  this.initLocateElements(); // Enable AccuSnap locate, set view cursor, add CoordinateLockOverrides to disable unwanted pre-locate point adjustments...
 }
 // __PUBLISH_EXTRACT_END__
}

export class CreateByPointsTool extends PrimitiveTool {
 public static toolId = "Create.ByPoints";
 // __PUBLISH_EXTRACT_START__ PrimitiveTool_PointsTool
 public readonly points: Point3d[] = [];

 public setupAndPromptForNextAction(): void {
  // NOTE: Tool should call IModelApp.notifications.outputPromptByKey or IModelApp.notifications.outputPrompt to tell user what to do.
  IModelApp.accuSnap.enableSnap(true); // Enable AccuSnap so that linestring can be created by snapping to existing geometry

  if (0 === this.points.length) return;

  const hints = new AccuDrawHintBuilder();
  hints.enableSmartRotation = true; // Set initial AccuDraw orientation based on snapped geometry (ex. sketch on face of a solid)

  if (this.points.length > 1 && !this.points[this.points.length - 1].isAlmostEqual(this.points[this.points.length - 2]))
   hints.setXAxis(Vector3d.createStartEnd(this.points[this.points.length - 2], this.points[this.points.length - 1])); // Align AccuDraw with last accepted segment

  hints.setOrigin(this.points[this.points.length - 1]); // Set compass origin to last accepted point.
  hints.sendHints();
 }

 public onDynamicFrame(ev: BeButtonEvent, context: DynamicsContext): void {
  if (this.points.length < 1) return;

  const tmpPoints = this.points.slice(); // Create shallow copy of accepted points
  tmpPoints.push(ev.point.clone()); // Include current cursor location

  const builder = context.createSceneGraphicBuilder();
  builder.setSymbology(context.viewport.getContrastToBackgroundColor(), ColorDef.black, 1);
  builder.addLineString(tmpPoints);
  context.addGraphic(builder.finish()); // Show linestring in view
 }

 public async onDataButtonDown(ev: BeButtonEvent): Promise<EventHandled> {
  this.points.push(ev.point.clone()); // Accumulate accepted points, ev.point has been adjusted by AccuSnap and locks
  this.setupAndPromptForNextAction();

  if (!this.isDynamicsStarted) this.beginDynamics(); // Start dynamics on first data button so that onDynamicFrame will be called

  return EventHandled.No;
 }

 public async onResetButtonUp(_ev: BeButtonEvent): Promise<EventHandled> {
  await this.onReinitialize(); // Complete current linestring
  return EventHandled.No;
 }

 public async onPostInstall() {
  await super.onPostInstall();
  this.setupAndPromptForNextAction();
 }
 // __PUBLISH_EXTRACT_END__

 public async onRestartTool() {
  const tool = new CreateByPointsTool();
  if (!(await tool.run())) return this.exitTool();
 }
}
