import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "Redux/Reducer";

export function SmartDeviceProperties() {
 // To configure Redux follow this sample :

 // https://github.com/aruniverse/mytwin-viewer-samples/blob/MarkerTools/src/ui/MarkerTool/Widget.tsx
 // https://github.com/aruniverse/mytwin-viewer-samples/blob/MarkerTools/src/ui/MarkerTool/UiProvider.tsx

 const element = useSelector<RootState /* RootState type */, any /* output value type example : number | undefined */>(
  (state: RootState) => state.appState?.selectedSmartDeviceElement
 );

 const tableList: JSX.Element[] = [];
 if (element) {
  Object.keys(element).forEach((property: string) => {
   if (property !== "geometryStream") {
    let data = element[property];
    if (typeof data === "object") {
     var output = "{ ";
     for (var propt in data) {
      output += propt + ": " + data[propt] + "; ";
     }
     data = output + "}";
    }
    tableList.push(
     <tr>
      <th>{property}</th>
      <th>{data}</th>
     </tr>
    );
   }
  });
  return (
   <table className="smart-table">
    <tbody>
     <tr>
      <th>Property</th>
      <th>Value</th>
     </tr>
     {tableList}
    </tbody>
   </table>
  );
 } else {
  return <div></div>;
 }
}

// need to check why mapStateToProps not working while using dynamic registerReducer
// const mapStateToProps = (state: AppState) => {
//  return {
//   element: state.widgetState.selectedElement,
//  };
// };
// const mapDispatchToProps = (dispatch: any) => {
//  return { setSelectedElement: (element: any) => dispatch(setSelectedElement(element)) };
// };
// export default connect(mapStateToProps)(SmartDeviceProperties);
