import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";
import * as React from "react";

export function SmartDeviceListWidgetComponent() {
 const [smartTableList, setSmartTableList] = React.useState<JSX.Element[]>([]);

 React.useEffect(() => {
  (async () => {
   const query = `
  SELECT EcInstanceId,SmartDeviceId,SmartDeviceType,
          Origin
          FROM DgnCustomItemTypes_HouseSchema.SmartDevice
          WHERE Origin IS NOT NULL
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
