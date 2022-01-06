import { Logger } from "@bentley/bentleyjs-core";
import { Point3d } from "@bentley/geometry-core";
import { BeButtonEvent, EventHandled, IModelApp, PrimitiveTool, ToolAssistance, ToolAssistanceImage, ToolAssistanceInputMethod } from "@bentley/imodeljs-frontend";
import { PinDecorator, PinMarker } from "components/decorators/PinDecorator";
import { LoggingCategory } from "Logging/Logging";

export class PlacePin extends PrimitiveTool {
 public static readonly toolId = "PlacePin";

 // we use the non-null assertion (!) operator to tell typescript even if it isn't directly
 // initialized all usages will be valid because we know `run` sets it before it's used
 private _setPins!: (pins: Point3d[]) => void;
 private _getPins!: () => Point3d[];

 public async onDataButtonDown(ev: BeButtonEvent) {
  Logger.logInfo(LoggingCategory.PlacePinTool, "Placing Pin", () => "Method name: onDataButtonDown");
  const nextPins = [...this._getPins(), ev.point];
  this._setPins(nextPins);
  PinDecorator.pins = nextPins.map((p) => new PinMarker(p));
  // this.exitTool(); // only let them place one marker at a time
  this.setupAndPromptForNextAction();
  return EventHandled.Yes;
 }

 public async onResetButtonDown(_ev: BeButtonEvent) {
  const previousPinsLength = this._getPins().length;
  const currentPins = this._getPins().filter((el) => !el.isAlmostEqual(_ev.point));
  this._setPins(currentPins);
  PinDecorator.pins = currentPins.map((p) => new PinMarker(p));

  // rerender only when a marker is removed
  if (currentPins.length !== previousPinsLength) {
   IModelApp.viewManager.selectedView?.invalidateDecorations();
  }
  this.onReinitialize();

  this.setupAndPromptForNextAction();

  return EventHandled.Yes;
 }

 //  We have used callback functions here just for demo
 public run(inGetPins: PlacePin["_getPins"], inSetPins: PlacePin["_setPins"]) {
  this._getPins = inGetPins;
  this._setPins = inSetPins;
  return super.run();
 }

 public onPostInstall(): void {
  this.setupAndPromptForNextAction();
 }

 public requireWriteableTarget = () => false;

 public onRestartTool() {
  this.setupAndPromptForNextAction();
 }

 protected setupAndPromptForNextAction(): void {
  this.provideToolAssistance();
 }

 protected provideToolAssistance(): void {
  const mainInstruction = ToolAssistance.createInstruction(ToolAssistanceImage.CursorClick, IModelApp.i18n.translate("Camera:tools.PlacePin.keyin"));
  const instruction1 = ToolAssistance.createInstruction(
   ToolAssistanceImage.LeftClick,
   IModelApp.i18n.translate("Camera:tools.PlacePin.prompt1"),
   false,
   ToolAssistanceInputMethod.Mouse
  );
  const instruction2 = ToolAssistance.createInstruction(
   ToolAssistanceImage.RightClick,
   IModelApp.i18n.translate("Camera:tools.PlacePin.prompt2"),
   false,
   ToolAssistanceInputMethod.Mouse
  );

  const instructionT1 = ToolAssistance.createInstruction(
   ToolAssistanceImage.OneTouchTap,
   IModelApp.i18n.translate("Camera:tools.PlacePin.prompt1"),
   false,
   ToolAssistanceInputMethod.Touch
  );
  const instructionT2 = ToolAssistance.createInstruction(
   ToolAssistanceImage.TwoTouchTap,
   IModelApp.i18n.translate("Camera:tools.PlacePin.prompt4"),
   false,
   ToolAssistanceInputMethod.Touch
  );

  const section1 = ToolAssistance.createSection([instruction1, instruction2, instructionT1, instructionT2], ToolAssistance.inputsLabel);

  const instructions = ToolAssistance.createInstructions(mainInstruction, [section1]);

  IModelApp.notifications.setToolAssistance(instructions);
 }
}
