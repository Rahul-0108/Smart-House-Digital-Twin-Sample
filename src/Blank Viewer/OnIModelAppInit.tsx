import {
 AngleSweep,
 Arc3d,
 CurveFactory,
 CurveLocationDetail,
 CurvePrimitive,
 LineSegment3d,
 LineString3d,
 Loop,
 Path,
 Point3d,
 Range3d,
 Ray3d,
 Vector3d,
} from "@bentley/geometry-core";
import { Cartographic, ColorDef, LinePixels } from "@bentley/imodeljs-common";
import { BlankConnectionProps, IModelApp, LocalUnitFormatProvider, OverrideFormatEntry, QuantityType, ScreenViewport } from "@bentley/imodeljs-frontend";
import { GeometryDecorator } from "./GeometryDecorator";
import { DrawMarker } from "./DrawMarker";

export const openGeometryblankConnection = (): BlankConnectionProps => {
 const connection: BlankConnectionProps = {
  name: "GeometryConnection",
  location: Cartographic.fromDegrees(0, 0, 0),
  extents: new Range3d(-25, -25, -25, 25, 25, 25), // give less range to show the grid zoomed ,eg, new Range3d(-5, -5, -5, 5, 5, 5),
 };
 return connection;
};

// create a new blank connection centered on Exton PA
export function openBlankConnection() {
 const exton: BlankConnectionProps = {
  // call this connection "Exton PA"
  name: "Exton PA",
  // put the center of the connection near Exton, Pennsylvania (Bentley's HQ)
  location: Cartographic.fromDegrees(-75.686694, 40.065757, 0),
  // create the area-of-interest to be 2000 x 2000 x 200 meters, centered around 0,0.0
  extents: new Range3d(-1000, -1000, -100, 1000, 1000, 100),
 };
 return exton;
}

export const initializeBlankViewer = async () => {
 await IModelApp.quantityFormatter.setActiveUnitSystem("metric");

 const overrideLengthFormats: OverrideFormatEntry = {
  metric: {
   composite: {
    includeZero: true,
    spacer: " ",
    units: [{ label: "m", name: "Units.M" }],
   },
   formatTraits: ["keepSingleZero", "showUnitLabel", "use1000Separator"],
   thousandSeparator: ",",
   precision: 2,
   type: "Decimal",
  },
 };

 await IModelApp.quantityFormatter.setOverrideFormats(QuantityType.Length, overrideLengthFormats);
 await IModelApp.quantityFormatter.setUnitFormattingSettingsProvider(new LocalUnitFormatProvider(IModelApp.quantityFormatter, true));

 const formatPropsByQuantityType = IModelApp.quantityFormatter.getFormatPropsByQuantityType(QuantityType.Length, "metric", false);
 IModelApp.viewManager.onViewOpen.addOnce((viewport: ScreenViewport) => {
  //   // turn on the background map
  //   viewport.view.displayStyle.viewFlags.backgroundMap = true;
  //   viewport.changeBackgroundMapProps({ providerName: "BingProvider" });
  //   // viewport.view.displayStyle.backgroundColor = ColorDef.white;
  //   // turn on the ground and skybox in the environment
  //   //  const env = style.environment;
  //   //  env.ground.display = true;
  //   //  env.sky.display = true;
  //   //  style.environment = env; // call to accessor to get the json properties to reflect the changes
  //   viewport.synchWithView();

  IModelApp.viewManager.addDecorator(GeometryDecorator.Instance());

  GeometryDecorator.Instance().addPoints([new Point3d(-21, 0, 0)]);

  GeometryDecorator.Instance().setLinePixels(LinePixels.Code2);
  GeometryDecorator.Instance().setLineThickness(2);
  GeometryDecorator.Instance().addGeometry(LineSegment3d.create(new Point3d(-22, -2, 0), new Point3d(-20, 2, 0)));

  GeometryDecorator.Instance().setLinePixels(LinePixels.Solid);
  GeometryDecorator.Instance().setLineThickness(1);
  const loopJoiningPoints = [new Point3d(0, 0, 0), new Point3d(10, 0, 0), new Point3d(10, 20, 0), new Point3d(0, 0, 0)]; //  We shoulde use the same reference point in loop , Path
  GeometryDecorator.Instance().addGeometry(
   Loop.create(
    LineSegment3d.create(loopJoiningPoints[0], loopJoiningPoints[1]),
    LineString3d.create([loopJoiningPoints[1], new Point3d(10, 10, 0), new Point3d(14, 20, 0), loopJoiningPoints[2]]),
    LineString3d.create([loopJoiningPoints[2], new Point3d(0, 20, 0), loopJoiningPoints[0]])
   )
  );

  const PathJoiningpoint = new Point3d(25, 0, 0); //  We shoulde use the same reference point in loop , Path
  GeometryDecorator.Instance().addGeometry(
   Path.create(LineSegment3d.create(new Point3d(20, -10, 0), PathJoiningpoint), LineString3d.create([PathJoiningpoint, new Point3d(10, -10, 0)]))
  );

  GeometryDecorator.Instance().addGeometry(CurveFactory.createRectangleXY(-20, -20, -10, -10, 0, 2 /* edge curve radius */));

  /**
   * Construct a sequence of alternating lines and arcs with the arcs creating tangent transition between consecutive edges.
   *  * If the radius parameter is a number, that radius is used throughout.
   *  * If the radius parameter is an array of numbers, `radius[i]` is applied at `point[i]`.
   *    * Note that since no fillet is constructed at the initial or final point, those entries in `radius[]` are never referenced.
   *    * A zero radius for any point indicates to leave the as a simple corner.
   * @param points point source
   * @param radius fillet radius or array of radii indexed to correspond to the points.
   * @param allowBackupAlongEdge true to allow edges to be created going "backwards" along edges if needed to create the blend.
   * */
  GeometryDecorator.Instance().addGeometry(CurveFactory.createFilletsInLineString([new Point3d(-8, -20, 0), new Point3d(0, -10, 0), new Point3d(10, -20, 0)], 2)!);

  GeometryDecorator.Instance().addMarker(new DrawMarker(new Point3d(-18, 18, 0), ColorDef.blue));

  GeometryDecorator.Instance().addMarker(
   new DrawMarker((GeometryDecorator.Instance().shapes[1].geometry as CurvePrimitive).closestPoint(new Point3d(-18, 18, 0), false)?.point!, ColorDef.white)
  );

  GeometryDecorator.Instance().setLineThickness(5);
  GeometryDecorator.Instance().addGeometry(LineSegment3d.create(new Point3d(-42, 12, 0), new Point3d(-28, 24, 0)));

  fracToPointAndDerivativeVisualization(GeometryDecorator.Instance().shapes[5].geometry as CurvePrimitive, 0.8);

  GeometryDecorator.Instance().addGeometry(Arc3d.createXY(new Point3d(-12, 4, 0), 5));

  fracToPointAndDerivativeVisualization(GeometryDecorator.Instance().shapes[8].geometry as CurvePrimitive, 0.8);
 });
};
export function fracToPointAndDerivativeVisualization(geometry: CurvePrimitive, fraction: number) {
 GeometryDecorator.Instance().setLineThickness(2);
 GeometryDecorator.Instance().setColor(ColorDef.green);
 GeometryDecorator.Instance().setFillColor(ColorDef.green);
 const { origin, direction } = geometry.fractionToPointAndDerivative(fraction);
 GeometryDecorator.Instance().addMarker(new DrawMarker(origin, ColorDef.white));
 const unitVectorAlongDerivative: Vector3d | undefined = direction.normalize(); // Return a unit vector parallel with this
 const arrowStem = origin?.plusScaled(unitVectorAlongDerivative!, 2); // Return point + vector * scalar

 const arrowPeak = origin.plusScaled(unitVectorAlongDerivative!, 3);

 GeometryDecorator.Instance().addGeometry(LineSegment3d.create(origin, arrowStem));

 const unitPerpendicularVector = unitVectorAlongDerivative?.unitPerpendicularXY(); // Return a vector which is in the xy plane, perpendicular ot the xy part of this
 //  vector, and of unit length.

 GeometryDecorator.Instance().addGeometry(
  // Create  Triangle
  Loop.create(
   LineString3d.create(
    arrowStem.plusScaled(unitPerpendicularVector!, 0.5),
    arrowStem.plusScaled(unitPerpendicularVector!, -0.5),
    arrowPeak,
    arrowStem.plusScaled(unitPerpendicularVector!, 0.5)
   )
  )
 );
}
