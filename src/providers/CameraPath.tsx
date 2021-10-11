import { Point3d, Vector3d } from "@bentley/geometry-core";
import { IModelApp, ViewState3d } from "@bentley/imodeljs-frontend";
import { Button, Input } from "@bentley/ui-core";
import React, { useState } from "react";

const savedCameraViews = [
 {
  eyePoint: new Point3d(-2.0366846600010033, 1.3340338011125157, 3.088012700532253),
  targetPoint: new Point3d(3.6182722594041143, 8.79127786373179, -2.8264282092682396),
 },
 {
  eyePoint: new Point3d(1.6082585407929426, -1.5958485299181322, 2.878888818504199),
  targetPoint: new Point3d(5.203449244253822, 3.145162747350455, -0.8812712106760654),
 },
 {
  eyePoint: new Point3d(0.1666780258359819, -0.17880204532942567, 3.287242847659717),
  targetPoint: new Point3d(2.9726679010579824, 3.5214827906106394, 0.35249700484879565),
 },
 {
  eyePoint: new Point3d(14.931836235114615, 11.407111504774678, 3.3205128760637024),
  targetPoint: new Point3d(5.065798876586227, 6.0310113428951135, -0.24710623315220115),
 },
 {
  eyePoint: new Point3d(12.66255270418655, 0.765818733925254, 7.739752120507087),
  targetPoint: new Point3d(9.063852365085882, 4.364519073025922, 4.141051781406418),
 },
 {
  eyePoint: new Point3d(7.255663158170519, -5.992606897189457, 4.549794203830997),
  targetPoint: new Point3d(6.573684015399454, -0.04893809305298813, 2.620915167861633),
 },
 {
  eyePoint: new Point3d(1.3630656869791835, 13.84256228613613, 12.533297327074479),
  targetPoint: new Point3d(4.461714438853285, 7.633934153000378, 2.083158654434815),
 },
];

const savedCameraViewButtons = savedCameraViews.map((view, index) => (
 <Button
  style={{ marginTop: "12px", marginLeft: "8px" }}
  onClick={async () => {
   (IModelApp.viewManager.selectedView?.view as ViewState3d).lookAtUsingLensAngle(
    view.eyePoint,
    view.targetPoint,
    new Vector3d(0, 0, 1),
    (IModelApp.viewManager.selectedView?.view as ViewState3d).camera.lens,
    undefined,
    undefined,
    { animateFrustumChange: true }
   );
   IModelApp.viewManager.selectedView?.synchWithView();
  }}
 >{`Saved View ${index + 1}`}</Button>
));

function CameraPath() {
 const [currentEyePoint, setCurrentEyePoint] = useState<Point3d>();
 const [currentTargetPoint, setCurrentargetPoint] = useState<Point3d>();

 return (
  <div>
   <Button
    style={{ marginTop: "12px", marginLeft: "8px" }}
    onClick={() => {
     const currentEye = (IModelApp.viewManager.selectedView?.view as ViewState3d).getEyePoint();
     setCurrentEyePoint(new Point3d(currentEye.x, currentEye.y, currentEye.z));
    }}
   >
    Camera Eye
   </Button>
   <Input
    style={{ width: "88%", marginTop: "8px", marginLeft: "8px" }}
    value={currentEyePoint ? `{ x: ${currentEyePoint?.x}, y: ${currentEyePoint?.y}, z: ${currentEyePoint?.z} }` : ""}
   />

   <Button
    style={{ marginTop: "12px", marginLeft: "8px" }}
    onClick={() => {
     const currentTarget = (IModelApp.viewManager.selectedView?.view as ViewState3d).getTargetPoint();
     setCurrentargetPoint(new Point3d(currentTarget.x, currentTarget.y, currentTarget.z));
    }}
   >
    Camera Direction
   </Button>
   <Input
    style={{ width: "88%", marginTop: "8px", marginLeft: "8px" }}
    value={currentTargetPoint ? `{ x: ${currentTargetPoint?.x}, y: ${currentTargetPoint?.y}, z: ${currentTargetPoint?.z} }` : ""}
   />

   <Button
    style={{ marginTop: "12px", marginLeft: "8px" }}
    onClick={async () => {
     if (currentEyePoint && currentTargetPoint) {
      (IModelApp.viewManager.selectedView?.view as ViewState3d).lookAtUsingLensAngle(
       currentEyePoint,
       currentTargetPoint,
       new Vector3d(0, 0, 1),
       (IModelApp.viewManager.selectedView?.view as ViewState3d).camera.lens,
       undefined,
       undefined,
       { animateFrustumChange: true }
      );
      IModelApp.viewManager.selectedView?.synchWithView();
     }
    }}
   >
    Go to Saved Camera View
   </Button>
   <div>{savedCameraViewButtons}</div>
  </div>
 );
}

export default CameraPath;
