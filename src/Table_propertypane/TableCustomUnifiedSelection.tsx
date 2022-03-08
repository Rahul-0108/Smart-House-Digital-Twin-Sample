// https://medium.com/itwinjs/hooking-3rd-party-component-into-unified-selection-c4daec69789d
import * as React from "react";
import { Id64String } from "@bentley/bentleyjs-core";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import { PropertyRecord, PropertyValueFormat } from "@bentley/ui-abstract";
import { TableDataProvider, SimpleTableDataProvider, ColumnDescription, RowItem, Table } from "@bentley/ui-components";
import { InstanceKey } from "@bentley/presentation-common";
import { Presentation, SelectionChangeEventArgs } from "@bentley/presentation-frontend";

export function TableCustomUnifiedSelection(props: { imodel: IModelConnection }): JSX.Element {
 const [provider, setProvider] = React.useState<TableDataProvider | undefined>();
 React.useEffect(() => {
  setProvider(undefined);
  createDataProvider(props.imodel).then(setProvider);
 }, [props.imodel]);

 const onRowsSelected = React.useCallback(
  async (rowIterator: AsyncIterableIterator<RowItem>, replace: boolean) => {
   // accumulate instance keys of all selected rows
   const keys = new Array<InstanceKey>();
   for await (const row of rowIterator) keys.push(JSON.parse(row.key));
   // either replace or add to unified selection storage based on what happened in the component
   if (replace) Presentation.selection.replaceSelection("TableCustomUnifiedSelection", props.imodel, keys);
   else Presentation.selection.addToSelection("TableCustomUnifiedSelection", props.imodel, keys);
   return true;
  },
  [props.imodel]
 );

 const [isRowSelected, setIsRowSelected] = React.useState<(row: RowItem) => boolean>(createIsRowSelectedCallback(props.imodel));
 const onUnifiedSelectionChanged = React.useCallback(
  (args: SelectionChangeEventArgs) => {
   // only care about selection changes to the imodel we're displaying
   if (args.imodel === props.imodel) {
    // here we just re-set the `isRowSelected` state callback function - this is how
    // we can tell the Table component that it needs to refresh row selection states
    setIsRowSelected(createIsRowSelectedCallback(props.imodel));
    // The above code listens to unified selection changes and resets the Table.isRowSelected callback prop whenever that happens.
    // Table then calls the callback for each visible row to update row selection state and we can just check if ECInstance
    // ECInstance the row represents is
    // in unified selection storage.
   }
  },
  [props.imodel]
 );
 React.useEffect(() => {
  // subscribe to unified selection changes
  return Presentation.selection.selectionChange.addListener(onUnifiedSelectionChanged);
 }, [onUnifiedSelectionChanged]);

 return provider ? <Table dataProvider={provider} onRowsSelected={onRowsSelected} isRowSelected={isRowSelected} /> : <h2>{"Loading..."}</h2>;
}

function createIsRowSelectedCallback(imodel: IModelConnection) {
 return (row: RowItem) => {
  if (row) {
   // we know that in <code>row.key</code> we store serialized InstanceKey, so we can just de-serialize it here
   const key: InstanceKey = JSON.parse(row.key);
   // and check if the row should be selected
   return Presentation.selection.getSelection(imodel).has(key);
  } else {
   return false;
  }
 };
}

const createInstanceKey = (record: { className: string; id: Id64String }): InstanceKey => ({
 className: record.className.replace(".", ":"),
 id: record.id,
});

const createRowItem = (record: { className: string; id: Id64String; userLabel: string }) => ({
 key: JSON.stringify(createInstanceKey(record)), // just serialize the instance key to string
 cells: [
  {
   key: "id",
   record: new PropertyRecord({ valueFormat: PropertyValueFormat.Primitive, value: record.id, displayValue: record.id }, { name: "id", displayLabel: "ID", typename: "string" }),
  },
  {
   key: "label",
   record: new PropertyRecord(
    { valueFormat: PropertyValueFormat.Primitive, value: record.userLabel, displayValue: record.userLabel },
    { name: "label", displayLabel: "Label", typename: "string" }
   ),
  },
 ],
});

const createDataProvider = async (imodel: IModelConnection) => {
 const columns = new Array<ColumnDescription>();
 columns.push({ key: "id", label: "ID", width: 50 });
 columns.push({ key: "label", label: "Label", width: 200 });

 const rows = new Array<RowItem>();
 // also select ECClassId - that returns us ECClass name we need to create the instance key
 for await (const record of imodel.query("SELECT ECClassId, ECInstanceId, UserLabel FROM bis.GeometricElement")) rows.push(createRowItem(record));

 const provider = new SimpleTableDataProvider(columns);
 provider.setItems(rows);
 return provider;
};
