import { IModelApp } from "@bentley/imodeljs-frontend";
import { RelativePosition } from "@bentley/ui-abstract";

export function showCard() {
 // ElementTooltip.isTooltipHalted = true; // remove viewport Element hover toolTip

 const contentContainer = document.createElement("div");
 contentContainer.innerHTML = "I am a tooltip";

 // Add HTMLElements as child elements of contentContainer

 IModelApp.uiAdmin.showCard(
  contentContainer,
  "Title",
  undefined,
  IModelApp.uiAdmin.cursorPosition,
  IModelApp.uiAdmin.createXAndY(8, 8),
  () => {},
  () => {
   IModelApp.uiAdmin.hideCard();
  },
  RelativePosition.Right
 );
}
