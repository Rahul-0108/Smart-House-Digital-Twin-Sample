import { Point3d, Vector3d } from "@bentley/geometry-core";
import { IModelApp, ViewState3d } from "@bentley/imodeljs-frontend";
import { Button, Input } from "@bentley/ui-core";
import { SyncUiEventArgs, SyncUiEventDispatcher } from "@bentley/ui-framework";
import { ProductSettingsService } from "iTwin Cloud Services/ProductSettingsService";
import React, { useState, useEffect } from "react";
import { AppActionId } from "Redux/Action";
import { showCard } from "ui-core components/Card";
import { SampleModalDialog } from "ui-core components/SampleModalDialog ";

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

function CameraView() {
 const [currentCameraPoint, setCurrentCameraPoint] = useState<{ eye: Point3d | undefined; target: Point3d | undefined }>();
 const [showDialog, setShowDialog] = useState<boolean>();

 useEffect(() => {
  const handleSyncUiEvent = (args: SyncUiEventArgs) => {
   if (args.eventIds.has(AppActionId.set_Selected_SmartDevice_Element)) {
    // Filter the event Id We need
    setShowDialog(true);
   }
  };
  SyncUiEventDispatcher.onSyncUiEvent.addListener(handleSyncUiEvent); // Listner for SynUiEvents, can listen a Redux Action or an Event fired using
  // SyncUiEventDispatcher.dispatchSyncUiEvent
  setTimeout(() => {
   ProductSettingsService.getUserSetting(
    "spa-3ZbQOKSVnH4Zo2sFdzwDlEMPI",
    "UserCameraSettings",
    true,
    process.env.IMJS_CONTEXT_ID!,
    process.env.IMJS_IMODEL_ID
   ).then((data) => {
    if (data?.setting) {
     const cameraPoint = JSON.parse(data.setting);
     if (cameraPoint) {
      setCurrentCameraPoint({
       eye: cameraPoint.eye.x ? Point3d.fromJSON(cameraPoint.eye) : undefined,
       target: cameraPoint.target.x ? Point3d.fromJSON(cameraPoint.target) : undefined,
      });
     }
    }
   });
  }, 20);

  return () => {
   SyncUiEventDispatcher.onSyncUiEvent.removeListener(handleSyncUiEvent);
  };
 }, []);

 return (
  <div>
   {showDialog && <SampleModalDialog opened={true} onResult={() => setShowDialog(false)} />}
   <Button
    onMouseOver={() => showCard()}
    style={{ marginTop: "12px", marginLeft: "8px" }}
    onClick={async () => {
     const currentEye = (IModelApp.viewManager.selectedView?.view as ViewState3d).getEyePoint();
     await ProductSettingsService.saveUserSetting(
      JSON.stringify({
       eye: { x: currentEye?.x, y: currentEye.y, z: currentEye?.z },
       target: { x: currentCameraPoint?.target?.x, y: currentCameraPoint?.target?.y, z: currentCameraPoint?.target?.z },
      }),
      "spa-3ZbQOKSVnH4Zo2sFdzwDlEMPI",
      "UserCameraSettings",
      true,
      process.env.IMJS_CONTEXT_ID!,
      process.env.IMJS_IMODEL_ID
     );
     setCurrentCameraPoint({ eye: new Point3d(currentEye.x, currentEye.y, currentEye.z), target: currentCameraPoint?.target! });
    }}
   >
    {IModelApp.i18n.translate("Camera:camera.cameraEye")}
   </Button>
   <Input
    style={{ width: "88%", marginTop: "8px", marginLeft: "8px" }}
    value={
     currentCameraPoint?.eye
      ? `{ x: ${currentCameraPoint.eye?.x}, y: ${currentCameraPoint.eye?.y}, z: ${currentCameraPoint.eye?.z} }`
      : ""
    }
   />

   <Button
    style={{ marginTop: "12px", marginLeft: "8px" }}
    onClick={async () => {
     const currentTarget = (IModelApp.viewManager.selectedView?.view as ViewState3d).getTargetPoint();
     await ProductSettingsService.saveUserSetting(
      JSON.stringify({
       eye: { x: currentCameraPoint?.eye?.x, y: currentCameraPoint?.eye?.y, z: currentCameraPoint?.eye?.z },
       target: { x: currentTarget?.x, y: currentTarget.y, z: currentTarget?.z },
      }),
      "spa-3ZbQOKSVnH4Zo2sFdzwDlEMPI",
      "UserCameraSettings",
      true,
      process.env.IMJS_CONTEXT_ID!,
      process.env.IMJS_IMODEL_ID
     );
     setCurrentCameraPoint({
      eye: currentCameraPoint?.eye!,
      target: new Point3d(currentTarget.x, currentTarget.y, currentTarget.z),
     });
    }}
   >
    Camera Direction
   </Button>
   <Input
    style={{ width: "88%", marginTop: "8px", marginLeft: "8px" }}
    value={
     currentCameraPoint?.target
      ? `{ x: ${currentCameraPoint?.target?.x}, y: ${currentCameraPoint?.target?.y}, z: ${currentCameraPoint?.target?.z} }`
      : ""
    }
   />

   <Button
    style={{ marginTop: "12px", marginLeft: "8px" }}
    onClick={async () => {
     if (currentCameraPoint && currentCameraPoint?.eye && currentCameraPoint?.target) {
      (IModelApp.viewManager.selectedView?.view as ViewState3d).lookAtUsingLensAngle(
       currentCameraPoint?.eye,
       currentCameraPoint?.target,
       new Vector3d(0, 0, 1),
       (IModelApp.viewManager.selectedView?.view as ViewState3d).camera.lens,
       undefined,
       undefined,
       { animateFrustumChange: true }
      );
      IModelApp.viewManager.selectedView?.synchWithView();
      setShowDialog(true);
     }
    }}
   >
    Go to Saved Camera View
   </Button>
   <div>{savedCameraViewButtons}</div>
  </div>
 );
}

export default CameraView;
