import { UiFramework } from "@bentley/ui-framework";
import * as React from "react";
import { AppActionId } from "Redux/Action";
import { showContextMenu } from "ui-core components/ContextMenu";

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
       UiFramework.dispatchActionToStore(AppActionId.set_Selected_SmartDevice_Element, value);
       //  IModelApp.viewManager.selectedView!.zoomToElements(value.id, {
       //   animateFrustumChange: true,
       //   standardViewId: StandardViewId.RightIso,
       //  });
       showContextMenu();
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

// need to check in future why mapStateToProps not working while using dynamic registerReducer

// const mapStateToProps = (state: any) => {
//  return {
//   element: state.widgetState.selectedElement,
//  };
// };

// const mapDispatchToProps = (dispatch: any) => {
//  return { setSelectedElement: (element: any) => dispatch(setSelectedElement(element)) };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(SmartDeviceListWidgetComponent);
