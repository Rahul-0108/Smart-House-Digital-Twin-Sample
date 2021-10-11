import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Subject } from "rxjs";

export const elementSubject = new Subject<any>();

export function SmartDeviceProperties(props: any) {
 const [element, setElement] = useState<any>();
 useEffect(() => {
  elementSubject.subscribe((value) => setElement(value));
  return () => elementSubject.unsubscribe();
 }, []);

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

// const mapStateToProps = (state: any) => {
//  return {
//   selectedElement: state.widgetState.selectedElement,
//  };
// };
// export default connect(mapStateToProps, undefined)(SmartDeviceProperties);
