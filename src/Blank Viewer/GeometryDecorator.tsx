import {
 Arc3d,
 CurveChainWithDistanceIndex,
 GeometryQuery,
 IndexedPolyface,
 IndexedPolyfaceVisitor,
 LineSegment3d,
 LineString3d,
 Loop,
 Path,
 Point3d,
 Transform,
} from "@bentley/geometry-core";
import { DecorateContext, Decorator, GraphicBranch, GraphicBuilder, GraphicType, IModelApp, Marker, RenderGraphic } from "@bentley/imodeljs-frontend";
import { ColorDef, LinePixels, TextString, ViewFlagOverrides } from "@bentley/imodeljs-common";

// Since all geometry is rendered concurrently, when adding geometry, we attach their desired attributes to them in an object
interface CustomGeometryQuery {
 geometry: GeometryQuery;
 color: ColorDef;
 fill: boolean;
 fillColor: ColorDef;
 lineThickness: number;
 edges: boolean;
 linePixels: LinePixels;
}

interface CustomPoint {
 point: Point3d;
 color: ColorDef;
 fill: boolean;
 lineThickness: number;
}

export class GeometryDecorator implements Decorator {
 private graphics: RenderGraphic | undefined;

 private points: CustomPoint[] = [];
 public shapes: CustomGeometryQuery[] = [];
 private text: TextString[] = [];
 private markers: Marker[] = [];

 private fill: boolean = true;
 private color: ColorDef = ColorDef.black;
 private fillColor: ColorDef = ColorDef.create("rgb(255,255,0)");
 private lineThickness: number = 1;
 private edges: boolean = true;
 private linePixels = LinePixels.Solid;

 private static geometryDecorator: GeometryDecorator | undefined;

 public static Instance() {
  if (!GeometryDecorator.geometryDecorator) {
   GeometryDecorator.geometryDecorator = new GeometryDecorator();
  }
  return GeometryDecorator.geometryDecorator;
 }

 public addMarker(marker: Marker) {
  this.markers.push(marker);
 }

 public clearMarkers() {
  this.markers = [];
 }

 public addLine(line: LineSegment3d) {
  const styledGeometry: CustomGeometryQuery = {
   geometry: line,
   color: this.color,
   fill: this.fill,
   fillColor: this.fillColor,
   lineThickness: this.lineThickness,
   edges: this.edges,
   linePixels: this.linePixels,
  };
  this.shapes.push(styledGeometry);
 }

 public addPoint(point: Point3d) {
  const styledPoint: CustomPoint = {
   point,
   color: this.fillColor,
   fill: this.fill,
   lineThickness: this.lineThickness,
  };
  this.points.push(styledPoint);
 }

 public addText(text: TextString) {
  this.text.push(text);
 }

 public addPoints(points: Point3d[]) {
  points.forEach((point) => {
   this.addPoint(point);
  });
 }

 public addGeometry(geometry: GeometryQuery) {
  const styledGeometry: CustomGeometryQuery = {
   geometry,
   color: this.color,
   fill: this.fill,
   fillColor: this.fillColor,
   lineThickness: this.lineThickness,
   edges: this.edges,
   linePixels: this.linePixels,
  };
  this.shapes.push(styledGeometry);
 }

 public addArc(arc: Arc3d) {
  const styledGeometry: CustomGeometryQuery = {
   geometry: arc,
   color: this.color,
   fill: this.fill,
   fillColor: this.fillColor,
   lineThickness: this.lineThickness,
   edges: this.edges,
   linePixels: this.linePixels,
  };
  this.shapes.push(styledGeometry);
 }

 public clearGeometry() {
  this.markers = [];
  this.points = [];
  this.shapes = [];
  this.graphics = undefined;
  IModelApp.viewManager.invalidateDecorationsAllViews();
 }

 public reRenderGeometry() {
  this.graphics = undefined;
  IModelApp.viewManager.invalidateDecorationsAllViews();
 }

 public setColor(color: ColorDef) {
  this.color = color;
 }

 public setFill(fill: boolean) {
  this.fill = fill;
 }

 public setFillColor(color: ColorDef) {
  this.fillColor = color;
 }

 public setLineThickness(lineThickness: number) {
  this.lineThickness = lineThickness;
 }

 public setEdges(edges: boolean) {
  this.edges = edges;
 }

 public setLinePixels(linePixels: LinePixels) {
  this.linePixels = linePixels;
 }

 // Iterate through the geometry and point lists, extracting each geometry and point, along with their styles
 // Adding them to the graphic builder which then creates new graphics
 public createGraphics(context: DecorateContext): RenderGraphic | undefined {
  // Specifying an Id for the graphics tells the display system that all of the geometry belongs to the same entity, so that it knows to make sure the edges
  // draw on top of the surfaces.

  /** Create a builder for creating a [[RenderGraphic]] of the specified type appropriate for rendering within this context's [[Viewport]].
   * @param type The type of builder to create.
   * @param transform the local-to-world transform in which the builder's geometry is to be defined.
   * @param id If the decoration is to be pickable, a unique identifier to associate with the resultant [[RenderGraphic]].
   * @returns A builder for creating a [[RenderGraphic]] of the specified type appropriate for rendering within this context's [[Viewport]].
   * @see [[IModelConnection.transientIds]] for obtaining an ID for a pickable decoration.
   **/
  const builder = context.createGraphicBuilder(
   GraphicType.Scene,
   undefined,
   context.viewport.iModel.transientIds.next /*Generator for unique Ids of transient graphics for this IModelConnection. */
  );
  // Controls whether normals are generated for surfaces.
  //@note — Normals are required for proper edge display, so they are always produced if [[wantEdges]] is true.
  // @see — [[GraphicBuilderOptions.wantNormals]] for more details.
  builder.wantNormals = true;
  this.points.forEach((styledPoint) => {
   /** Sets the current active symbology for this builder. Any new geometry subsequently added will be drawn using the specified symbology.
    * @param lineColor The color in which to draw lines.
    * @param fillColor The color in which to draw filled regions.
    * @param lineWidth The width in pixels to draw lines. The renderer will clamp this value to an integer in the range [1, 32].
    * @param linePixels The pixel pattern in which to draw lines.
    * @see [[GraphicBuilder.activateGraphicParams]] for additional symbology options.
    * */
   builder.setSymbology(styledPoint.color, styledPoint.fill ? styledPoint.color : ColorDef.white, styledPoint.lineThickness);
   const point = styledPoint.point;
   const circle = Arc3d.createXY(point, 0.2);
   builder.addArc(circle, false, styledPoint.fill);
  });
  this.shapes.forEach((styledGeometry) => {
   const geometry = styledGeometry.geometry;
   builder.setSymbology(
    styledGeometry.color,
    styledGeometry.fill ? styledGeometry.fillColor : ColorDef.create(ColorDef.withTransparency(styledGeometry.color.tbgr, 255)),
    styledGeometry.lineThickness,
    styledGeometry.linePixels
   );
   this.createGraphicsForGeometry(geometry, styledGeometry.edges, builder);
  });

  // Processes the accumulated symbology and geometry to produce a renderable graphic. This function can only be called once; after the [[RenderGraphic]]
  // has been extracted the [[GraphicBuilder]] should no longer be used.
  const graphic: RenderGraphic = builder.finish();
  return graphic;
 }

 private createGraphicsForGeometry(geometry: GeometryQuery, wantEdges: boolean, builder: GraphicBuilder) {
  if (geometry instanceof LineString3d) {
   builder.addLineString(geometry.points);
  } else if (geometry instanceof Loop) {
   builder.addLoop(geometry);
   if (wantEdges) {
    // Since decorators don't natively support visual edges,
    // We draw them manually as lines along each loop edge/arc
    builder.setSymbology(ColorDef.green, ColorDef.white, 5);
    const curves = geometry.children;
    curves.forEach((value) => {
     if (value instanceof LineString3d) {
      let edges = value.points;
      // const endPoint = value.pointAt(0);
      // if (endPoint) {
      //  edges = edges.concat([endPoint]);
      // }
      builder.addLineString(edges);
     } else if (value instanceof LineSegment3d) {
      builder.addLineString([value.point0Ref, value.point1Ref]); //  We shoulde use the same reference point as defined in  Geometry
     } else if (value instanceof Arc3d) {
      builder.addArc(value, false, false);
     }
    });
   }
  } else if (geometry instanceof Path) {
   builder.addPath(geometry);
  } else if (geometry instanceof IndexedPolyface) {
   builder.addPolyface(geometry, false);
   if (wantEdges) {
    // Since decorators don't natively support visual edges,
    // We draw them manually as lines along each facet edge
    builder.setSymbology(ColorDef.black, ColorDef.black, 2);
    const visitor = IndexedPolyfaceVisitor.create(geometry, 1);
    let flag = true;
    while (flag) {
     const numIndices = visitor.pointCount;
     for (let i = 0; i < numIndices - 1; i++) {
      const point1 = visitor.getPoint(i);
      const point2 = visitor.getPoint(i + 1);
      if (point1 && point2) {
       builder.addLineString([point1, point2]);
      }
     }
     flag = visitor.moveToNextFacet();
    }
   }
  } else if (geometry instanceof LineSegment3d) {
   const pointA = geometry.point0Ref;
   const pointB = geometry.point1Ref;
   const lineString = [pointA, pointB];
   builder.addLineString(lineString); // there is no addLineSegment api in builder , so  Better use  addLineString
  } else if (geometry instanceof Arc3d) {
   builder.addArc(geometry, false, false);
  } else if (geometry instanceof CurveChainWithDistanceIndex) {
   this.createGraphicsForGeometry(geometry.path, wantEdges, builder);
  }
 }

 // Generates new graphics if needed, and adds them to the scene
 public decorate(context: DecorateContext): void {
  // Construct a ViewFlagOverrides which overrides all flags to match the specified ViewFlags, or overrides nothing if no ViewFlags are supplied.
  const overrides = new ViewFlagOverrides();
  overrides.setShowVisibleEdges(true);
  overrides.setApplyLighting(true);

  // Constructor
  // @param ownsEntries — If true, when this branch is [[dispose]]d, all of the [[RenderGraphic]]s it contains will also be disposed.
  const branch = new GraphicBranch(false);

  branch.setViewFlagOverrides(overrides);

  context.viewFlags.visibleEdges = true; // Shows or hides visible edges in the shaded render mode.
  if (!this.graphics) this.graphics = this.createGraphics(context);

  if (this.graphics) branch.add(this.graphics);

  /** Create a [[RenderGraphic]] which groups a set of graphics into a node in a scene graph, applying to each a transform and optional clip volume and symbology overrides.
   * @param branch Contains the group of graphics and the symbology overrides.
   * @param location the local-to-world transform applied to the grouped graphics.
   * @returns A RenderGraphic suitable for drawing the scene graph node within this context's [[Viewport]].
   * @see [[RenderSystem.createBranch]]
   */
  const graphic = context.createBranch(branch, Transform.identity);
  /** Adds a graphic to the set of [[Decorations]] to be drawn in this context's [[ScreenViewport]].
   * @param The type of the graphic, which determines to which list of decorations it is added.
   * @param decoration The decoration graphic to add.
   * @note The type must match the type with which the [[RenderGraphic]]'s [[GraphicBuilder]] was constructed.
   * @see [[DecorateContext.addDecorationFromBuilder]] for a more convenient API.
   */
  context.addDecoration(GraphicType.Scene, graphic);

  this.markers.forEach((marker) => {
   marker.addDecoration(context);
  });
 }

 // Draws a base for the 3d geometry
 public drawBase(origin: Point3d = new Point3d(0, 0, 0), width: number = 20, length: number = 20) {
  const oldEdges = this.edges;
  const oldColor = this.color;
  this.edges = false;
  const points: Point3d[] = [];
  points.push(Point3d.create(origin.x - width / 2, origin.y - length / 2, origin.z - 0.05));
  points.push(Point3d.create(origin.x - width / 2, origin.y + length / 2, origin.z - 0.05));
  points.push(Point3d.create(origin.x + width / 2, origin.y + length / 2, origin.z - 0.05));
  points.push(Point3d.create(origin.x + width / 2, origin.y - length / 2, origin.z - 0.05));
  const linestring = LineString3d.create(points);
  const loop = Loop.create(linestring.clone());
  this.setColor(ColorDef.fromTbgr(ColorDef.withTransparency(ColorDef.green.tbgr, 150)));
  this.addGeometry(loop);
  this.color = oldColor;
  this.edges = oldEdges;
 }
}
