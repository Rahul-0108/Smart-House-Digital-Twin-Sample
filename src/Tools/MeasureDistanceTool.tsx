import { PrimitiveTool } from "@bentley/imodeljs-frontend";

// export class MeasureDistanceTool extends PrimitiveTool {
//  public static override toolId = "Measure.Distance";
//  public static override iconSpec = "icon-measure-distance";
//  /** @internal */
//  protected readonly _locationData = new Array<Location>();
//  /** @internal */
//  protected readonly _acceptedSegments = new Array<Segment>();
//  /** @internal */
//  protected _totalDistance: number = 0.0;
//  /** @internal */
//  protected _totalDistanceMarker?: MeasureLabel;
//  /** @internal */
//  protected _snapGeomId?: string;
//  /** @internal */
//  protected _lastMotionPt?: Point3d;
//  /** @internal */
//  protected _lastMotionAdjustedPt?: Point3d;

//  /** @internal */
//  protected allowView(vp: Viewport) {
//   return vp.view.isSpatialView() || vp.view.isDrawingView();
//  }
//  /** @internal */
//  public override isCompatibleViewport(vp: Viewport | undefined, isSelectedViewChange: boolean): boolean {
//   return super.isCompatibleViewport(vp, isSelectedViewChange) && undefined !== vp && this.allowView(vp);
//  }
//  /** @internal */
//  public override isValidLocation(_ev: BeButtonEvent, _isButtonEvent: boolean): boolean {
//   return true;
//  }
//  /** @internal */
//  public override requireWriteableTarget(): boolean {
//   return false;
//  }
//  /** @internal */
//  public override async onPostInstall() {
//   await super.onPostInstall();
//   this.setupAndPromptForNextAction();
//  }
//  /** @internal */
//  public override async onUnsuspend() {
//   this.showPrompt();
//  }

//  /** @internal */
//  protected showPrompt(): void {
//   const mainInstruction = ToolAssistance.createInstruction(
//    this.iconSpec,
//    CoreTools.translate(
//     0 === this._locationData.length ? "Measure.Distance.Prompts.FirstPoint" : "Measure.Distance.Prompts.NextPoint"
//    )
//   );
//   const mouseInstructions: ToolAssistanceInstruction[] = [];
//   const touchInstructions: ToolAssistanceInstruction[] = [];

//   if (!ToolAssistance.createTouchCursorInstructions(touchInstructions))
//    touchInstructions.push(
//     ToolAssistance.createInstruction(
//      ToolAssistanceImage.OneTouchTap,
//      CoreTools.translate("ElementSet.Inputs.AcceptPoint"),
//      false,
//      ToolAssistanceInputMethod.Touch
//     )
//    );
//   mouseInstructions.push(
//    ToolAssistance.createInstruction(
//     ToolAssistanceImage.LeftClick,
//     CoreTools.translate("ElementSet.Inputs.AcceptPoint"),
//     false,
//     ToolAssistanceInputMethod.Mouse
//    )
//   );
//   if (0 === this._locationData.length) {
//    if (this._acceptedSegments.length > 0) {
//     touchInstructions.push(
//      ToolAssistance.createInstruction(
//       ToolAssistanceImage.TwoTouchTap,
//       CoreTools.translate("ElementSet.Inputs.Restart"),
//       false,
//       ToolAssistanceInputMethod.Touch
//      )
//     );
//     mouseInstructions.push(
//      ToolAssistance.createInstruction(
//       ToolAssistanceImage.RightClick,
//       CoreTools.translate("ElementSet.Inputs.Restart"),
//       false,
//       ToolAssistanceInputMethod.Mouse
//      )
//     );
//    }
//   } else {
//    touchInstructions.push(
//     ToolAssistance.createInstruction(
//      ToolAssistanceImage.TwoTouchTap,
//      CoreTools.translate("ElementSet.Inputs.Cancel"),
//      false,
//      ToolAssistanceInputMethod.Touch
//     )
//    );
//    mouseInstructions.push(
//     ToolAssistance.createInstruction(
//      ToolAssistanceImage.RightClick,
//      CoreTools.translate("ElementSet.Inputs.Cancel"),
//      false,
//      ToolAssistanceInputMethod.Mouse
//     )
//    );
//    mouseInstructions.push(
//     ToolAssistance.createModifierKeyInstruction(
//      ToolAssistance.ctrlKey,
//      ToolAssistanceImage.LeftClick,
//      CoreTools.translate("ElementSet.Inputs.AdditionalPoint"),
//      false,
//      ToolAssistanceInputMethod.Mouse
//     )
//    );
//    mouseInstructions.push(
//     ToolAssistance.createKeyboardInstruction(
//      ToolAssistance.createKeyboardInfo([ToolAssistance.ctrlKey, "Z"]),
//      CoreTools.translate("ElementSet.Inputs.UndoLastPoint"),
//      false,
//      ToolAssistanceInputMethod.Mouse
//     )
//    );
//   }

//   const sections: ToolAssistanceSection[] = [];
//   sections.push(ToolAssistance.createSection(mouseInstructions, ToolAssistance.inputsLabel));
//   sections.push(ToolAssistance.createSection(touchInstructions, ToolAssistance.inputsLabel));

//   const instructions = ToolAssistance.createInstructions(mainInstruction, sections);
//   IModelApp.notifications.setToolAssistance(instructions);
//  }

//  /** @internal */
//  protected setupAndPromptForNextAction(): void {
//   IModelApp.accuSnap.enableSnap(true);
//   const hints = new AccuDrawHintBuilder();
//   hints.enableSmartRotation = true;
//   hints.setModeRectangular();
//   hints.sendHints(false);
//   IModelApp.toolAdmin.setCursor(
//    0 === this._locationData.length ? IModelApp.viewManager.crossHairCursor : IModelApp.viewManager.dynamicsCursor
//   );
//   this.showPrompt();
//  }

//  /** @internal */
//  public override testDecorationHit(id: string): boolean {
//   return id === this._snapGeomId;
//  }

//  /** @internal */
//  protected getSnapPoints(): Point3d[] | undefined {
//   if (this._acceptedSegments.length < 1 && this._locationData.length < 2) return undefined;

//   const snapPoints: Point3d[] = [];
//   for (const seg of this._acceptedSegments) {
//    if (0 === snapPoints.length || !seg.start.isAlmostEqual(snapPoints[snapPoints.length - 1])) snapPoints.push(seg.start);
//    if (!seg.end.isAlmostEqual(snapPoints[0])) snapPoints.push(seg.end);
//   }

//   if (this._locationData.length > 1) for (const loc of this._locationData) snapPoints.push(loc.point);
//   return snapPoints;
//  }

//  /** @internal */
//  public override getDecorationGeometry(_hit: HitDetail): GeometryStreamProps | undefined {
//   const snapPoints = this.getSnapPoints();
//   if (undefined === snapPoints) return undefined;
//   const geomData = IModelJson.Writer.toIModelJson(PointString3d.create(snapPoints));
//   return undefined === geomData ? undefined : [geomData];
//  }

//  /** @internal */
//  protected displayDynamicDistance(context: DecorateContext, points: Point3d[], adjustedPoints: Point3d[]): void {
//   let totalDistance = 0.0;
//   for (let i = 0; i < adjustedPoints.length - 1; i++) totalDistance += adjustedPoints[i].distance(adjustedPoints[i + 1]);
//   if (0.0 === totalDistance) return;

//   const formatterSpec = IModelApp.quantityFormatter.findFormatterSpecByQuantityType(QuantityType.Length);
//   if (undefined === formatterSpec) return;
//   const formattedTotalDistance = IModelApp.quantityFormatter.formatQuantity(totalDistance, formatterSpec);
//   const distDyn = new MeasureLabel(points[points.length - 1], formattedTotalDistance);
//   distDyn.addDecoration(context);
//  }

//  /** @internal */
//  protected displayDelta(context: DecorateContext, seg: any): void {
//   const xVec = new Vector3d(seg.delta.x, 0.0, 0.0);
//   const yVec = new Vector3d(0.0, seg.delta.y, 0.0);
//   const zVec = new Vector3d(0.0, 0.0, seg.delta.z);

//   seg.refAxes.multiplyVectorInPlace(xVec);
//   seg.refAxes.multiplyVectorInPlace(yVec);
//   seg.refAxes.multiplyVectorInPlace(zVec);

//   const builderAxes = context.createGraphicBuilder(GraphicType.WorldOverlay);
//   let basePt = seg.start.clone();

//   if (xVec.magnitude() > 1.0e-5) {
//    const segPoints: Point3d[] = [];
//    segPoints.push(basePt);
//    basePt = basePt.plus(xVec);
//    segPoints.push(basePt);
//    const colorX = ColorDef.red.adjustedForContrast(context.viewport.view.backgroundColor);
//    builderAxes.setSymbology(colorX, ColorDef.black, 5);
//    builderAxes.addLineString(segPoints);
//   }

//   if (yVec.magnitude() > 1.0e-5) {
//    const segPoints: Point3d[] = [];
//    segPoints.push(basePt);
//    basePt = basePt.plus(yVec);
//    segPoints.push(basePt);
//    const colorY = ColorDef.green.adjustedForContrast(context.viewport.view.backgroundColor);
//    builderAxes.setSymbology(colorY, ColorDef.black, 5);
//    builderAxes.addLineString(segPoints);
//   }

//   if (zVec.magnitude() > 1.0e-5) {
//    const segPoints: Point3d[] = [];
//    segPoints.push(basePt);
//    basePt = basePt.plus(zVec);
//    segPoints.push(basePt);
//    const colorZ = ColorDef.blue.adjustedForContrast(context.viewport.view.backgroundColor);
//    builderAxes.setSymbology(colorZ, ColorDef.black, 5);
//    builderAxes.addLineString(segPoints);
//   }

//   const segGlow = context.viewport.hilite.color.withAlpha(50);
//   builderAxes.setSymbology(segGlow, ColorDef.black, 8);
//   builderAxes.addLineString([seg.start, seg.end]);

//   context.addDecorationFromBuilder(builderAxes);
//  }

//  /** @internal */
//  protected createDecorations(context: DecorateContext, isSuspended: boolean): void {
//   if (!this.isCompatibleViewport(context.viewport, false)) return;

//   if (
//    !isSuspended &&
//    this._locationData.length > 0 &&
//    undefined !== this._lastMotionPt &&
//    undefined !== this._lastMotionAdjustedPt
//   ) {
//    const tmpPoints: Point3d[] = [];
//    const tmpAdjustedPoints: Point3d[] = [];
//    for (const loc of this._locationData) {
//     tmpPoints.push(loc.point); // Deep copy not necessary...
//     tmpAdjustedPoints.push(loc.adjustedPoint);
//    }
//    tmpPoints.push(this._lastMotionPt);
//    tmpAdjustedPoints.push(this._lastMotionAdjustedPt);

//    const builderDynVis = context.createGraphicBuilder(GraphicType.WorldDecoration);
//    const colorDynVis = context.viewport.hilite.color;

//    builderDynVis.setSymbology(colorDynVis, ColorDef.black, 3);
//    builderDynVis.addLineString(tmpPoints);

//    context.addDecorationFromBuilder(builderDynVis);

//    const builderDynHid = context.createGraphicBuilder(GraphicType.WorldOverlay);
//    const colorDynHid = colorDynVis.withAlpha(100);

//    builderDynHid.setSymbology(colorDynHid, ColorDef.black, 1, LinePixels.Code2);
//    builderDynHid.addLineString(tmpPoints);

//    context.addDecorationFromBuilder(builderDynHid);
//    this.displayDynamicDistance(context, tmpPoints, tmpAdjustedPoints);
//   }

//   if (this._acceptedSegments.length > 0) {
//    const builderAccVis = context.createGraphicBuilder(GraphicType.WorldDecoration);
//    const builderAccHid = context.createGraphicBuilder(GraphicType.WorldOverlay);
//    const colorAccVis = ColorDef.white.adjustedForContrast(context.viewport.view.backgroundColor);
//    const colorAccHid = colorAccVis.withAlpha(100);

//    builderAccVis.setSymbology(colorAccVis, ColorDef.black, 3);
//    builderAccHid.setSymbology(colorAccHid, ColorDef.black, 1, LinePixels.Code2);

//    for (const seg of this._acceptedSegments) {
//     builderAccVis.addLineString([seg.start, seg.end]);
//     builderAccHid.addLineString([seg.start, seg.end]);
//     seg.marker.addDecoration(context);
//     if (seg.marker.isSelected) this.displayDelta(context, seg);
//    }

//    context.addDecorationFromBuilder(builderAccVis);
//    context.addDecorationFromBuilder(builderAccHid);
//   }

//   if (undefined !== this._totalDistanceMarker) this._totalDistanceMarker.addDecoration(context);

//   const snapPoints = this.getSnapPoints();
//   if (undefined === snapPoints) return;

//   if (undefined === this._snapGeomId) this._snapGeomId = this.iModel.transientIds.next;

//   const builderSnapPts = context.createGraphicBuilder(GraphicType.WorldOverlay, undefined, this._snapGeomId);
//   const colorAccPts = ColorDef.white.adjustedForContrast(context.viewport.view.backgroundColor);

//   builderSnapPts.setSymbology(colorAccPts, ColorDef.black, 7);
//   builderSnapPts.addPointString(snapPoints);

//   context.addDecorationFromBuilder(builderSnapPts);
//  }

//  /** @internal */
//  public override decorate(context: DecorateContext): void {
//   this.createDecorations(context, false);
//  }
//  /** @internal */
//  public override decorateSuspended(context: DecorateContext): void {
//   this.createDecorations(context, true);
//  }

//  /** @internal */
//  public override async onMouseMotion(ev: BeButtonEvent): Promise<void> {
//   if (this._locationData.length > 0 && undefined !== ev.viewport) {
//    const point = ev.point;
//    const adjustedPoint = adjustPoint(ev, this._acceptedSegments, this._locationData);
//    if (undefined !== this._lastMotionPt) {
//     this._lastMotionPt.setFrom(point);
//     this._lastMotionAdjustedPt?.setFrom(adjustedPoint);
//    } else {
//     this._lastMotionPt = point.clone();
//     this._lastMotionAdjustedPt = adjustedPoint;
//    }
//    ev.viewport.invalidateDecorations();
//   }
//  }

//  protected reportMeasurements(): void {
//   if (undefined === this._totalDistanceMarker) return;
//   const briefMsg = `${CoreTools.translate(
//    this._acceptedSegments.length > 1 ? "Measure.Labels.CumulativeDistance" : "Measure.Labels.Distance"
//   )}: ${this._totalDistanceMarker.label}`;
//   const msgDetail = new NotifyMessageDetails(OutputMessagePriority.Info, briefMsg, undefined, OutputMessageType.Sticky);
//   IModelApp.notifications.outputMessage(msgDetail);
//  }

//  protected async updateTotals(): Promise<void> {
//   this._totalDistance = 0.0;
//   this._totalDistanceMarker = undefined;
//   for (const seg of this._acceptedSegments) this._totalDistance += seg.distance;
//   if (0.0 === this._totalDistance) return;

//   const formatterSpec = await IModelApp.quantityFormatter.getFormatterSpecByQuantityType(QuantityType.Length);
//   if (undefined === formatterSpec) return;

//   const formattedTotalDistance = IModelApp.quantityFormatter.formatQuantity(this._totalDistance, formatterSpec);
//   this._totalDistanceMarker = new MeasureLabel(
//    this._acceptedSegments[this._acceptedSegments.length - 1].end,
//    formattedTotalDistance
//   );
//   this.reportMeasurements();
//  }

//  protected async getMarkerToolTip(
//   distance: number,
//   slope: number,
//   start: Point3d,
//   end: Point3d,
//   delta?: Vector3d
//  ): Promise<HTMLElement> {
//   const is3d = undefined === this.targetView || this.targetView.view.is3d();
//   const isSpatial = undefined !== this.targetView && this.targetView.view.isSpatialView();
//   const toolTip = document.createElement("div");

//   const distanceFormatterSpec = await IModelApp.quantityFormatter.getFormatterSpecByQuantityType(QuantityType.Length);
//   if (undefined === distanceFormatterSpec) return toolTip;

//   let toolTipHtml = "";
//   const formattedDistance = IModelApp.quantityFormatter.formatQuantity(distance, distanceFormatterSpec);
//   toolTipHtml += `${translateBold("Distance") + formattedDistance}<br>`;

//   if (is3d) {
//    const angleFormatterSpec = await IModelApp.quantityFormatter.getFormatterSpecByQuantityType(QuantityType.Angle);
//    if (undefined !== angleFormatterSpec) {
//     const formattedSlope = IModelApp.quantityFormatter.formatQuantity(slope, angleFormatterSpec);
//     toolTipHtml += `${translateBold("Slope") + formattedSlope}<br>`;
//    }
//   }

//   const coordFormatterSpec = await IModelApp.quantityFormatter.getFormatterSpecByQuantityType(QuantityType.Coordinate);
//   if (undefined !== coordFormatterSpec) {
//    let startAdjusted = start;
//    let endAdjusted = end;
//    if (isSpatial) {
//     const globalOrigin = this.iModel.globalOrigin;
//     startAdjusted = startAdjusted.minus(globalOrigin);
//     endAdjusted = endAdjusted.minus(globalOrigin);
//    }

//    {
//     const formattedStartX = IModelApp.quantityFormatter.formatQuantity(startAdjusted.x, coordFormatterSpec);
//     const formattedStartY = IModelApp.quantityFormatter.formatQuantity(startAdjusted.y, coordFormatterSpec);
//     const formattedStartZ = IModelApp.quantityFormatter.formatQuantity(startAdjusted.z, coordFormatterSpec);
//     toolTipHtml += `${translateBold("StartCoord") + formattedStartX}, ${formattedStartY}`;
//     if (is3d) toolTipHtml += `, ${formattedStartZ}`;
//     toolTipHtml += "<br>";
//    }
//    const formattedEndX = IModelApp.quantityFormatter.formatQuantity(endAdjusted.x, coordFormatterSpec);
//    const formattedEndY = IModelApp.quantityFormatter.formatQuantity(endAdjusted.y, coordFormatterSpec);
//    const formattedEndZ = IModelApp.quantityFormatter.formatQuantity(endAdjusted.z, coordFormatterSpec);
//    toolTipHtml += `${translateBold("EndCoord") + formattedEndX}, ${formattedEndY}`;
//    if (is3d) toolTipHtml += `, ${formattedEndZ}`;
//    toolTipHtml += "<br>";
//   }

//   if (undefined !== delta) {
//    const formattedDeltaX = IModelApp.quantityFormatter.formatQuantity(Math.abs(delta.x), distanceFormatterSpec);
//    const formattedDeltaY = IModelApp.quantityFormatter.formatQuantity(Math.abs(delta.y), distanceFormatterSpec);
//    const formattedDeltaZ = IModelApp.quantityFormatter.formatQuantity(Math.abs(delta.z), distanceFormatterSpec);
//    toolTipHtml += `${translateBold("Delta") + formattedDeltaX}, ${formattedDeltaY}`;
//    if (is3d) toolTipHtml += `, ${formattedDeltaZ}`;
//    toolTipHtml += "<br>";
//   }

//   toolTip.innerHTML = toolTipHtml;
//   return toolTip;
//  }

//  /** @internal */
//  protected async updateSelectedMarkerToolTip(seg: any, ev: BeButtonEvent, reopenToolTip: boolean): Promise<void> {
//   seg.marker.title = await this.getMarkerToolTip(
//    seg.distance,
//    seg.slope,
//    seg.adjustedStart,
//    seg.adjustedEnd,
//    seg.marker.isSelected ? seg.adjustedDelta : undefined
//   );
//   if (!reopenToolTip || undefined === ev.viewport || !IModelApp.notifications.isToolTipOpen) return;
//   IModelApp.notifications.clearToolTip();
//   ev.viewport.openToolTip(seg.marker.title, ev.viewPoint);
//  }

//  /** @internal */
//  protected async acceptNewSegments(): Promise<void> {
//   if (this._locationData.length > 1) {
//    for (let i = 0; i <= this._locationData.length - 2; i++) {
//     const adjustedStart = this._locationData[i].adjustedPoint;
//     const adjustedEnd = this._locationData[i + 1].adjustedPoint;
//     const distance = adjustedStart.distance(adjustedEnd);
//     const xyDist = adjustedStart.distanceXY(adjustedEnd);
//     const zDist = adjustedEnd.z - adjustedStart.z;
//     const slope = 0.0 === xyDist ? Math.PI : Math.atan(zDist / xyDist);
//     const adjustedDelta = Vector3d.createStartEnd(adjustedStart, adjustedEnd);
//     const refAxes = this._locationData[i].refAxes;
//     refAxes.multiplyTransposeVectorInPlace(adjustedDelta);
//     const start = this._locationData[i].point;
//     const end = this._locationData[i + 1].point;
//     const delta = Vector3d.createStartEnd(start, end);
//     refAxes.multiplyTransposeVectorInPlace(delta);

//     const toolTip = await this.getMarkerToolTip(distance, slope, adjustedStart, adjustedEnd);
//     const marker = new MeasureMarker(
//      (this._acceptedSegments.length + 1).toString(),
//      toolTip,
//      start.interpolate(0.5, end),
//      Point2d.create(25, 25)
//     );

//     const segMarkerButtonFunc = (ev: BeButtonEvent) => {
//      if (ev.isDown) return true;

//      let selectedMarker: MeasureMarker | undefined;
//      let pickedMarker: MeasureMarker | undefined;
//      for (const seg of this._acceptedSegments) {
//       if (!seg.marker.pick(ev.viewPoint)) continue;
//       selectedMarker = seg.marker.isSelected ? undefined : seg.marker;
//       pickedMarker = seg.marker;
//       break;
//      }

//      for (const seg of this._acceptedSegments) {
//       const wasSelected = seg.marker.isSelected;
//       seg.marker.isSelected = seg.marker === selectedMarker;
//       if (wasSelected !== seg.marker.isSelected) this.updateSelectedMarkerToolTip(seg, ev, seg.marker === pickedMarker); // eslint-disable-line @typescript-eslint/no-floating-promises
//      }

//      if (undefined !== ev.viewport) ev.viewport.invalidateDecorations();
//      return true;
//     };

//     marker.onMouseButton = segMarkerButtonFunc; // eslint-disable-line @typescript-eslint/unbound-method
//     this._acceptedSegments.push({
//      distance,
//      slope,
//      start,
//      end,
//      delta,
//      adjustedStart,
//      adjustedEnd,
//      adjustedDelta,
//      refAxes,
//      marker,
//     });
//    }
//   }
//   this._locationData.length = 0;
//   await this.updateTotals();
//  }

//  /** @internal */
//  protected getReferenceAxes(vp?: Viewport): Matrix3d {
//   const refAxes = Matrix3d.createIdentity();
//   if (undefined !== vp && vp.isContextRotationRequired) vp.getAuxCoordRotation(refAxes);
//   return refAxes;
//  }

//  /** @internal */
//  public override async onDataButtonDown(ev: BeButtonEvent): Promise<EventHandled> {
//   const point = ev.point.clone();
//   const adjustedPoint = adjustPoint(ev, this._acceptedSegments, this._locationData);
//   const refAxes = this.getReferenceAxes(ev.viewport);
//   const zDir = refAxes.columnZ();
//   const normal = refAxes.columnZ();
//   const tangent = refAxes.columnX();
//   const snap = IModelApp.accuSnap.getCurrSnapDetail();

//   // Report xyz delta relative to world up. The surface normal and edge tangent help determine the rotation about z...
//   if (undefined !== snap) {
//    if (undefined !== snap.primitive) {
//     const locDetail = snap.primitive.closestPoint(point, false);
//     if (
//      undefined !== locDetail &&
//      (HitGeomType.Segment === snap.geomType ||
//       snap.primitive.isInPlane(Plane3dByOriginAndUnitNormal.create(point, undefined !== snap.normal ? snap.normal : normal)!))
//     ) {
//      const locRay = snap.primitive.fractionToPointAndUnitTangent(locDetail.fraction);
//      tangent.setFrom(locRay.direction);
//      if (undefined !== snap.normal) normal.setFrom(snap.normal);
//     }
//    } else if (undefined !== snap.normal) {
//     normal.setFrom(snap.normal);
//    }
//   }

//   if (!normal.isParallelTo(zDir, true)) {
//    const yDir = zDir.unitCrossProduct(normal);
//    if (undefined !== yDir) {
//     yDir.unitCrossProduct(zDir, normal);
//     Matrix3d.createColumnsInAxisOrder(AxisOrder.ZXY, normal, yDir, zDir, refAxes);
//    }
//   } else if (!tangent.isParallelTo(zDir, true)) {
//    const yDir = zDir.unitCrossProduct(tangent);
//    if (undefined !== yDir) {
//     yDir.unitCrossProduct(zDir, tangent);
//     Matrix3d.createColumnsInAxisOrder(AxisOrder.XYZ, tangent, yDir, zDir, refAxes);
//    }
//   }

//   this._locationData.push({ point, adjustedPoint, refAxes });

//   if (this._locationData.length > 1 && !ev.isControlKey) await this.acceptNewSegments();
//   this.setupAndPromptForNextAction();
//   if (undefined !== ev.viewport) ev.viewport.invalidateDecorations();
//   return EventHandled.No;
//  }

//  /** @internal */
//  public override async onResetButtonUp(ev: BeButtonEvent): Promise<EventHandled> {
//   if (0 === this._locationData.length) {
//    await this.onReinitialize();
//    return EventHandled.No;
//   }
//   await this.acceptNewSegments();
//   this.setupAndPromptForNextAction();
//   if (undefined !== ev.viewport) ev.viewport.invalidateDecorations();
//   return EventHandled.No;
//  }

//  /** @internal */
//  public override async onUndoPreviousStep(): Promise<boolean> {
//   if (0 === this._locationData.length && 0 === this._acceptedSegments.length) return false;

//   if (0 !== this._locationData.length) {
//    this._locationData.pop();
//   } else if (0 !== this._acceptedSegments.length) {
//    this._acceptedSegments.pop();
//   }

//   if (0 === this._locationData.length && 0 === this._acceptedSegments.length) {
//    await this.onReinitialize();
//   } else {
//    await this.updateTotals();
//    this.setupAndPromptForNextAction();
//   }
//   return true;
//  }

//  /** @internal */
//  public async onRestartTool(): Promise<void> {
//   const tool = new MeasureDistanceTool();
//   if (!(await tool.run())) return this.exitTool();
//  }
// }
