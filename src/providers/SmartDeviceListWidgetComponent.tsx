import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";
import * as React from "react";
import { connect } from "react-redux";
import { setSelectedElement } from "Redux/Action";
import { elementSubject } from "./SmartDeviceProperties";

export function SmartDeviceListWidgetComponent() {
 const [smartTableList, setSmartTableList] = React.useState<JSX.Element[]>([]);

 React.useEffect(() => {
  (async () => {
   const query = `
   SELECT * FROM DgnCustomItemTypes_HouseSchema.SmartDevice WHERE Origin IS NOT NULL
   `;
   const results = UiFramework.getIModelConnection()?.query(query);
   const values = [];
   for await (const row of results!) {
    values.push(row);
   }
   const tableList: JSX.Element[] = [];
   values.forEach((value) => {
    tableList.push(
     <tr
      onClick={() => {
       IModelApp.viewManager.selectedView!.zoomToElements(value.id, {
        animateFrustumChange: true,
        standardViewId: StandardViewId.RightIso,
       });
       elementSubject.next(value);
      }}
     >
      <th>{value.smartDeviceType}</th>
      <th>{value.smartDeviceId}</th>
     </tr>
    );
   });
   setSmartTableList(tableList);
  })();
 }, []);

 return (
  <table className="smart-table">
   <tbody>
    <tr>
     <th>SmartDeviceType</th>
     <th>SmartDeviceId</th>
    </tr>
    {smartTableList}
   </tbody>
  </table>
 );
}

// const mapDispatchToProps = (dispatch: any) => {
//  return { setSelectedElement: (element: any) => dispatch(setSelectedElement(element)) };
// };

// export default connect(undefined, mapDispatchToProps)(SmartDeviceListWidgetComponent);
