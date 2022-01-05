/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
 Angle,
 Arc3d,
 IndexedPolyface,
 LinearSweep,
 LineString3d,
 Path,
 Point3d,
 PolyfaceBuilder,
 Ray3d,
 RotationalSweep,
 RuledSweep,
 StrokeOptions,
 Vector3d,
} from "@bentley/geometry-core";
import { ColorByName, ColorDef } from "@bentley/imodeljs-common";
import { GeometryDecorator } from "./GeometryDecorator";

export default class AdvancedShapes3d {
 public static createLinearSweep() {
  const centerLine = Arc3d.createXY(new Point3d(25, 15, 0), 5);
  /**
   * Create a path from a variable length list of curve primitives
   * * CurvePrimitive params are captured !!!
   * @param curves variable length list of individual curve primitives or point arrays.
   */
  const curveChain = Path.create(centerLine);

  /**
   * A LinearSweep is a `SolidPrimitive` defined by
   * * A set of curves (any Loop, Path, or parityRegion)
   * * A sweep vector
   * If the object is "capped", the curves must be planar.
   * @public
   */

  /**
   * Create a sweep of a starting contour.
   * @param contour contour to be swept
   * @param direction sweep vector.  The contour is swept the full length of the vector.
   * @param capped true to include end caps
   */
  return LinearSweep.create(curveChain, new Vector3d(0, 0, 5), false);
 }

 public static createRotationalSweep() {
  const contour = Arc3d.createXYEllipse(new Point3d(5, -5, 7.5), 0.8, 0.2);
  const curveChain = Path.create(contour);
  return RotationalSweep.create(curveChain, Ray3d.create(new Point3d(5, 5, 7.5), new Vector3d(1, 1, 0)), Angle.createDegrees(180), false);
 }

 public static createRuledSweep() {
  const centerLine = Arc3d.createXY(new Point3d(-5, -5, 5), 5);
  const curveChain = Path.create(centerLine);
  const centerLine2 = Arc3d.createXY(new Point3d(-10, -10, 10), 10);
  const curveChain2 = Path.create(centerLine2);
  const centerLine3 = Arc3d.createXY(new Point3d(0, 0, 0), 10);
  const curveChain3 = Path.create(centerLine3);
  /**
   * Create a ruled sweep from an array of contours.
   * * the contours are CAPTURED (not cloned)
   */
  return RuledSweep.create([curveChain2, curveChain, curveChain3] /*CurveCollection[]*/, true /*capped*/);
 }
}

function getPolyface(): IndexedPolyface {
 const options = StrokeOptions.createForCurves();
 options.needParams = false;
 options.needNormals = true;
 const builder = PolyfaceBuilder.create(options);

 // geometryType === "Sweeps"

 // sweepType === "Linear"
 const linearSweep = AdvancedShapes3d.createLinearSweep();
 if (linearSweep) {
  /**
   *
   * Add facets from
   * * The swept contour
   * * each cap.
   */
  builder.addLinearSweep(linearSweep);
 }
 // sweepType === "Rotational"
 const rotationalSweep = AdvancedShapes3d.createRotationalSweep();
 if (rotationalSweep) {
  // builder.addRotationalSweep(rotationalSweep);
 }
 // sweepType === "Ruled"
 const ruleSweep = AdvancedShapes3d.createRuledSweep();
 if (ruleSweep) {
  /**
   * Add facets from a ruled sweep.
   */
  builder.addRuledSweep(ruleSweep);
 }

 // geometryType === "Mitered Pipes"
 const centerLine = LineString3d.create([
  [25, -5, 0],
  [22, -2, 2],
  [20, 0, 5],
  [15, 5, 5],
  [15, 5, 0],
 ]);
 builder.addMiteredPipes(centerLine /* Curve Primitive */, 0.5 /* radius */);

 return builder.claimPolyface(true /*compress*/); // extract the polyface.
}

export function createAdvancedShapes3d() {
 GeometryDecorator.Instance().clearGeometry();

 GeometryDecorator.Instance().setFillColor(ColorDef.fromTbgr(ColorDef.withTransparency(ColorDef.create(ColorByName.cyan).tbgr, 50)));
 GeometryDecorator.Instance().addGeometry(getPolyface());
 GeometryDecorator.Instance().drawBase(); // base for  All the  Geometry
}
