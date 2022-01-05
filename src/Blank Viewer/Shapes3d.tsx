/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Angle, AngleSweep, Arc3d, Box, Cone, IndexedPolyface, Point3d, PolyfaceBuilder, Range3d, Sphere, StrokeOptions, TorusPipe } from "@bentley/geometry-core";
import { ColorByName, ColorDef } from "@bentley/imodeljs-common";
import { GeometryDecorator } from "./GeometryDecorator";

export default class Shapes3d {
 public static createCone(height: number, lowerRadius: number, upperRadius: number): Cone | undefined {
  /** create a cylinder or cone from two endpoints and their radii.   The circular cross sections are perpendicular to the axis line
   * from start to end point.
   * * both radii must be of the same sign.
   * * negative radius is accepted to create interior surface.    Downstream effects of that combined with capping may be a problem.
   */
  return Cone.createAxisPoints(Point3d.create(-22, 0, 0), Point3d.create(-22, 0, height), lowerRadius, upperRadius, false);
 }

 public static createSphere(radius: number): Sphere | undefined {
  /** Create from center and radius, with optional restricted latitudes. */
  return Sphere.createCenterRadius(Point3d.create(22, 0, radius), radius);
 }

 public static createBox(length: number, width: number, height: number): Box | undefined {
  /**
   * Create an axis-aligned `Box` primitive for a range.
   * @param range range corners Origin of base rectangle
   * @param capped true to define top and bottom closure caps
   */
  return Box.createRange(new Range3d(0 - length / 2, 0 - width / 2, 0 / 2, 0 + length / 2, 0 + width / 2, height), false);
 }

 public static createTorusPipe(outerRadius: number, innerRadius: number, sweep: number) {
  /** Create a TorusPipe from its primary arc and minor radius */
  return TorusPipe.createAlongArc(Arc3d.createXY(new Point3d(0, 0, innerRadius), outerRadius, AngleSweep.create(Angle.createDegrees(sweep))), innerRadius, false);
 }
}

export function createShapes3d() {
 GeometryDecorator.Instance().clearGeometry();
 // create StrokeOptions with defaults appropriate for curves.
 const options = StrokeOptions.createForCurves();
 options.needParams = false;
 options.needNormals = true;
 // Create a builder with given StrokeOptions
 const builder: PolyfaceBuilder = PolyfaceBuilder.create(options);
 const cone = Shapes3d.createCone(5, 5, 3);
 if (cone) {
  builder.addCone(cone); // Add facets from a Cone
 }
 const sphere = Shapes3d.createSphere(4);
 if (sphere) {
  builder.addSphere(sphere); //  Add facets from a Sphere
 }
 const box = Shapes3d.createBox(8, 8, 8);
 if (box) {
  builder.addBox(box); //  Add facets from a Box
 }
 const polyface: IndexedPolyface = builder.claimPolyface(false); //  extract the polyface.
 GeometryDecorator.Instance().setFillColor(ColorDef.fromTbgr(ColorDef.withTransparency(ColorDef.create(ColorByName.cyan).tbgr, 50)));
 GeometryDecorator.Instance().addGeometry(polyface);
 GeometryDecorator.Instance().drawBase(); // base for  All the  Geometry
}
