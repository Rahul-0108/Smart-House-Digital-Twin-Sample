import * as React from "react";
import { Dialog, DialogButtonType } from "@bentley/ui-core";

export interface SampleModalDialogProps {
 opened: boolean;
 onResult?: (result: DialogButtonType) => void;
}

export interface SampleModalDialogState {
 opened: boolean;
}

export class SampleModalDialog extends React.Component<SampleModalDialogProps, SampleModalDialogState> {
 public readonly state: Readonly<SampleModalDialogState>;
 private _title = "Dialog";

 constructor(props: SampleModalDialogProps) {
  super(props);
  this.state = {
   opened: this.props.opened,
  };
 }

 public render(): JSX.Element {
  return (
   <Dialog
    title={this._title}
    opened={this.state.opened}
    modal={true}
    width={450}
    height={300}
    onClose={this._handleCancel}
    onEscape={this._handleCancel}
    onOutsideClick={this._handleCancel}
    buttonCluster={[
     { type: DialogButtonType.OK, onClick: this._handleOK },
     { type: DialogButtonType.Cancel, onClick: this._handleCancel },
    ]}
   >
    <div>
     Modal Dialog (We display this Dialog using 1) "Go to Saved View" Button Click 2) on Sync Ui Event dispatched using Redux when
     Smart Devices Table row is Clicked)
    </div>
   </Dialog>
  );
 }

 private _handleOK = () => {
  this._closeDialog(() => this.props.onResult && this.props.onResult(DialogButtonType.OK));
 };

 private _handleCancel = () => {
  this._closeDialog(() => this.props.onResult && this.props.onResult(DialogButtonType.Cancel));
 };

 private _closeDialog = (followUp: () => void) => {
  this.setState({ opened: false }, () => followUp());
 };
}
