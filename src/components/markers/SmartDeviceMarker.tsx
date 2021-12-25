import { Point3d, XAndY, XYAndZ } from "@bentley/geometry-core";
import { BeButtonEvent, IModelApp, Marker, NotifyMessageDetails, OutputMessagePriority, StandardViewId } from "@bentley/imodeljs-frontend";

export class SmartDeviceMarker extends Marker {
 private _smartDeviceId: string;
 private _location: Point3d;
 private _smartDeviceType: string;
 private _elementId: string;

 constructor(location: XYAndZ, size: XAndY, smartDeviceId: string, smartDeviceType: string, cloudData: any, elementId: string) {
  super(location, size);
  this._location = Point3d.create(location.x, location.y, location.z);
  this._smartDeviceId = smartDeviceId;
  this._smartDeviceType = smartDeviceType;
  this._elementId = elementId;

  this.setImageUrl(`/${this._smartDeviceType}.png`);
  // The title string, or HTMLElement, to show (only) in the ToolTip when the pointer is over this Marker.
  this.title = this.populateTitle(cloudData);
 }

 private populateTitle(cloudData: any) {
  /*
     "speaker001": { 
      "Notifications": 2, 
      "song Playing": true,
      "Song Name": "All I Want for Christmas Is You",
      "Song Artist": "Mariah Carey"
    },
  */
  let smartTable = "";
  for (const [key, value] of Object.entries(cloudData)) {
   smartTable += `
        <tr>
          <th>${key}</th>
          <th>${value}</th>
        </tr>
      `;
  }
  smartTable += `
  <tr>
    <th>${"Location"}</th>
    <th>${this._location.toArray()}</th>
  </tr>
`;

  const smartTableDiv = document.createElement("div");
  smartTableDiv.className = "smart-table";
  smartTableDiv.innerHTML = `
     <h3>${this._smartDeviceId}</h3>
     <table>
      ${smartTable}
     </table>
    `;

  return smartTableDiv;
 }

 // Called when a mouse button is pressed over this Marker. catches two Actions : MouseUp and Mousedown
 public onMouseButton(_ev: BeButtonEvent): boolean {
  if (!_ev.isDown) return true;

  // MessageManager.outputMessage(new ReactNotifyMessageDetails(OutputMessagePriority.Info, { reactNode: <div>{"Data"}</div> }));  //  shows  React Element in toast Message
  IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, "Element " + this._smartDeviceId + " was clicked on"));
  IModelApp.viewManager.selectedView!.zoomToElements(this._elementId, {
   animateFrustumChange: true,
   standardViewId: StandardViewId.RightIso,
  });
  return true;
 }
}
