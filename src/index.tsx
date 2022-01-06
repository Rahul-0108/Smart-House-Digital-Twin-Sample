/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ExampleBlankViewer from "Blank Viewer/BlankViewer";
import { Logging } from "Logging/Logging";

// Setup logging immediately in the App , iTwinViewer does not initializes logging , so We must do it
Logging.Initialize();

const isItwinViewer = true;

if (isItwinViewer) {
 ReactDOM.render(<App />, document.getElementById("root"));
} else {
 ReactDOM.render(<ExampleBlankViewer />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
