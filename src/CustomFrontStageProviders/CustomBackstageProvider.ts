import { FrontstageManager } from "@bentley/ui-framework";
import { ViewerBackstageItem } from "@itwin/viewer-react";

export function CustomBackstageProvider(): ViewerBackstageItem[] {
 const allBackstageItems: ViewerBackstageItem[] = [
  {
   stageId: "CustomFronstStage",
   id: "CustomFronstStage",
   groupPriority: 10,
   itemPriority: 10,
   label: "CustomFronstStage",
  },

  {
   id: "CustomFronstStage",
   execute: async () => {
    const frontstageDef = FrontstageManager.findFrontstageDef("CustomFronstStage");
    await FrontstageManager.setActiveFrontstageDef(frontstageDef);
   },
   groupPriority: 110,
   itemPriority: 10,
   label: "CustomFronstStage",
  },
 ];

 return allBackstageItems;
}
