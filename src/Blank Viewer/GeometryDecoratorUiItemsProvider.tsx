import { CurveCollection, CurvePrimitive, Point3d } from "@bentley/geometry-core";
import { ColorDef } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { Value } from "@bentley/presentation-common";
import { AbstractWidgetProps, AbstractZoneLocation, StagePanelLocation, StagePanelSection, UiItemsProvider } from "@bentley/ui-abstract";
import { Button, NumberInput } from "@bentley/ui-core";
import React from "react";
import { DrawMarker } from "./DrawMarker";
import { GeometryDecorator } from "./GeometryDecorator";
import { fracToPointAndDerivativeVisualization } from "./OnIModelAppInit";

export class GeometryDecoratorUiItemsProvider implements UiItemsProvider {
 public readonly id = "GeometryDecoratorUiItemsProvider";
 private static markerHorizontalValue: number;
 public provideWidgets(
  stageId: string,
  stageUsage: string,
  location: StagePanelLocation,
  section?: StagePanelSection,
  zoneLocation?: AbstractZoneLocation
 ): ReadonlyArray<AbstractWidgetProps> {
  const widgets: AbstractWidgetProps[] = [];
  if (stageId === "DefaultFrontstage" && location === StagePanelLocation.Right && section === StagePanelSection.Start) {
   const geometryWidget: AbstractWidgetProps = {
    id: "Geometry",
    label: "Geometry",
    getWidgetContent: () => {
     return (
      <div>
       <Button
        onClick={() => {
         (GeometryDecorator.Instance().shapes[1].geometry as CurveCollection).tryTranslateInPlace(1, 0, 0); // applies to the same instance
         (GeometryDecorator.Instance().shapes[2].geometry as CurveCollection).tryTranslateInPlace(-1, 0, 0);
         GeometryDecorator.Instance().reRenderGeometry();
        }}
       >
        {"CurveCollection translate"}
       </Button>
       <NumberInputComponent></NumberInputComponent>
       {/* {"FractionToPointAndDerivative"}
       <FractionToPointAndDerivativeComponent></FractionToPointAndDerivativeComponent> */}
      </div>
     );
    },
   };
   widgets.push(geometryWidget);
  }
  return widgets;
 }
}

function FractionToPointAndDerivativeComponent() {
 const [value, setValue] = React.useState<number>(0.8);

 return (
  <NumberInput
   maxLength={8}
   step={0.01}
   value={value}
   precision={2}
   onChange={(value: number | undefined, stringValue: string) => {
    setValue(value!);
    fracToPointAndDerivativeVisualization(GeometryDecorator.Instance().shapes[5].geometry as CurvePrimitive, value!);
    fracToPointAndDerivativeVisualization(GeometryDecorator.Instance().shapes[8].geometry as CurvePrimitive, value!);
    GeometryDecorator.Instance().reRenderGeometry();
   }}
  />
 );
}

function NumberInputComponent() {
 const [numberInputHorizontalValue, setNumberInpuHorizontaltValue] = React.useState<number>(-18);
 const [numberInputVerticalValue, setNumberInputVerticalValue] = React.useState<number>(18);

 return (
  <div>
   {"closest curve point"}
   <div></div>
   {"X"}
   <NumberInput
    value={numberInputHorizontalValue}
    onChange={(value: number | undefined, stringValue: string) => {
     setNumberInpuHorizontaltValue(value!);
     GeometryDecorator.Instance().clearMarkers();
     const spacePoint = new Point3d(value, numberInputVerticalValue, 0);
     GeometryDecorator.Instance().addMarker(new DrawMarker(spacePoint, ColorDef.blue));
     GeometryDecorator.Instance().addMarker(
      new DrawMarker((GeometryDecorator.Instance().shapes[1].geometry as CurvePrimitive).closestPoint(spacePoint, false)?.point!, ColorDef.white)
     );

     GeometryDecorator.Instance().reRenderGeometry();
    }}
   ></NumberInput>
   {"Y"}
   <NumberInput
    value={numberInputVerticalValue}
    onChange={(value: number | undefined, stringValue: string) => {
     setNumberInputVerticalValue(value!);
     GeometryDecorator.Instance().clearMarkers();
     const spacePoint = new Point3d(numberInputHorizontalValue, value, 0);
     GeometryDecorator.Instance().addMarker(new DrawMarker(spacePoint, ColorDef.blue));
     GeometryDecorator.Instance().addMarker(
      new DrawMarker((GeometryDecorator.Instance().shapes[1].geometry as CurvePrimitive).closestPoint(spacePoint, false)?.point!, ColorDef.white)
     );
     GeometryDecorator.Instance().reRenderGeometry();
    }}
   ></NumberInput>
  </div>
 );
}
