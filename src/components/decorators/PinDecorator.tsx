import { XAndY, XYAndZ } from "@bentley/geometry-core";
import { DecorateContext, Decorator, Marker } from "@bentley/imodeljs-frontend";

export class PinDecorator implements Decorator {
 public static pins: PinMarker[] = [];

 // when registered, decorate is called by the view manager every requested frame/update
 public decorate(ctx: DecorateContext) {
  for (const pin of PinDecorator.pins) {
   pin.addDecoration(ctx);
  }
 }
}

export class PinMarker extends Marker {
 public constructor(worldLocation: XYAndZ, size: XAndY = { x: 60, y: 60 }) {
  super(worldLocation, size);
  this.imageOffset = { x: 0, y: 30 };
  this.setImageUrl("/Placementmarker.svg");
 }
}
