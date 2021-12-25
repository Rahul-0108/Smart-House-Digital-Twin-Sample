import { Point3d } from "@bentley/geometry-core";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";
import { PinDecorator, PinMarker } from "components/decorators/PinDecorator";
import React from "react";
import { useSelector } from "react-redux";
import { AppActionId } from "Redux/Action";
import { RootState } from "Redux/Reducer";

export function MarkerPinsListWidget() {
 const allTotalPins = useSelector<RootState /* RootState type */, Point3d[] /* output value type example : number | undefined */>(
  (state: RootState) => state.appState?.pinLocations
 );
 return (
  <div>
   {allTotalPins.map((el) => (
    <div>
     <button
      onClick={() => {
       const currentPins = allTotalPins.filter((p) => p !== el);
       PinDecorator.pins = currentPins.map((p) => new PinMarker(p));

       UiFramework.dispatchActionToStore(AppActionId.set_Pin_Locations, currentPins);
       IModelApp.viewManager.invalidateDecorationsAllViews();
      }}
     >
      x
     </button>
     {el.toArray()}
    </div>
   ))}
  </div>
 );
}
