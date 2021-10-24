import { ModalFrontstageInfo } from "@bentley/ui-framework";
import React from "react";

/** Modal frontstage. */
export class CustomModalFrontstage implements ModalFrontstageInfo {
 public title: string = "CustomModalFrontstage";

 public get content(): React.ReactNode {
  return <SampleModalPage />;
 }
}

/** SampleModalPage displaying a modal frontstage page. */
class SampleModalPage extends React.Component {
 public render(): React.ReactNode {
  return <div>Hello World!</div>;
 }
}
