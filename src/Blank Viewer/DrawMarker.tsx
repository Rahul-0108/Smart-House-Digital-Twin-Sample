import { Point3d } from "@bentley/geometry-core";
import { ColorDef } from "@bentley/imodeljs-common";
import { Marker } from "@bentley/imodeljs-frontend";

// A Marker which is  Drawn
export class DrawMarker extends Marker {
 private _color: ColorDef;

 constructor(location: Point3d, color: ColorDef) {
  super(location, { x: 8, y: 8 }); // 8x8 is the marker size

  this._color = color;
 }

 /** Draw  Marker */
 public drawFunc(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.fillStyle = this._color.toRgbString();
  ctx.lineWidth = 1;
  ctx.arc(0, 0, this.size.x, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#372528";
  ctx.fillStyle = "black";
  ctx.lineWidth = 1;
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
 }
}
