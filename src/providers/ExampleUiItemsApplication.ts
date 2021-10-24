import { AbstractWidgetProps, CommonToolbarItem, UiItemsApplication, UiItemsApplicationAction } from "@bentley/ui-abstract";

// https://www.itwinjs.org/learning/ui/abstract/uiitemsprovider/#uiitemsarbiter
export class ExampleUiItemsApplication implements UiItemsApplication {
 public validateToolbarButtonItem(item: CommonToolbarItem): { updatedItem: CommonToolbarItem; action: UiItemsApplicationAction } {
  let action = UiItemsApplicationAction.Allow;
  if (item.id === "test-tool-group") action = UiItemsApplicationAction.Disallow;
  return { updatedItem: item, action };
 }
 //  /** Validate and optionally update a Widget */
 public validateWidget(widget: AbstractWidgetProps): { updatedWidget: AbstractWidgetProps; action: UiItemsApplicationAction } {
  console.log(widget.id);
  let action = UiItemsApplicationAction.Allow;
  if (widget.id === "vcr:PropertyGrid") {
  }
  return { updatedWidget: widget, action };
 }
}
