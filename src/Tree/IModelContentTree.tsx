/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as React from "react";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import { Ruleset } from "@bentley/presentation-common";
import { usePresentationTreeNodeLoader } from "@bentley/presentation-components";
import { ControlledTree, SelectionMode, useTreeEventsHandler, useVisibleTreeNodes } from "@bentley/ui-components";
import RULESET_TREE_HIERARCHY from "./Hierarchy1";

/**
 * Props for the [[IModelContentTree]] component
 */
export interface IModelContentTreeProps {
 iModel: IModelConnection;
}

/**
 * A tree component that shows content of an iModel
 */
export function IModelContentTree(props: IModelContentTreeProps) {
 // eslint-disable-line @typescript-eslint/naming-convention
 const { iModel } = props;
 const { nodeLoader } = usePresentationTreeNodeLoader({
  imodel: iModel,
  ruleset: RULESET_TREE_HIERARCHY as Ruleset,
  pagingSize: 20,
  appendChildrenCountForGroupingNodes: true,
 });
 const eventHandler = useTreeEventsHandler(React.useMemo(() => ({ nodeLoader, modelSource: nodeLoader.modelSource, collapsedChildrenDisposalEnabled: true }), [nodeLoader]));
 return (
  <ControlledTree
   nodeLoader={nodeLoader}
   selectionMode={SelectionMode.None}
   treeEvents={eventHandler}
   visibleNodes={useVisibleTreeNodes(nodeLoader.modelSource)}
   iconsEnabled={true}
  />
 );
}
