/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ChildNodeSpecificationTypes, RelationshipDirection, Ruleset, RuleTypes } from "@bentley/presentation-common";
// https://www.itwinjs.org/sample-showcase/?group=UI+Trees&sample=presetation-tree-sample&imodel=Metrostation+Sample
const ruleset: Ruleset = {
 id: "TreeHierarchy",
 requiredSchemas: [{ name: "BisCore" }],
 rules: [
  {
   ruleType: RuleTypes.RootNodes,
   autoExpand: true,
   specifications: [
    {
     specType: ChildNodeSpecificationTypes.InstanceNodesOfSpecificClasses,
     classes: [
      {
       schemaName: "BisCore",
       classNames: ["Subject"],
      },
     ],
     instanceFilter: "this.Parent = NULL",
     arePolymorphic: false,
     groupByClass: false,
     groupByLabel: false,
    },
   ],
  },
  {
   ruleType: RuleTypes.ChildNodes, // "RootNodes"
   condition: 'ParentNode.IsOfClass("Subject", "BisCore")',
   specifications: [
    {
     specType: ChildNodeSpecificationTypes.InstanceNodesOfSpecificClasses, // "InstanceNodesOfSpecificClasses"
     classes: [
      {
       schemaName: "BisCore",
       classNames: ["GeometricModel3d"],
      },
     ],
     arePolymorphic: true,
     groupByClass: false,
     groupByLabel: false,
    },
   ],
  },
  {
   ruleType: RuleTypes.ChildNodes, // "ChildNodes"
   condition: 'ParentNode.IsOfClass("GeometricModel3d", "BisCore")',
   specifications: [
    {
     specType: ChildNodeSpecificationTypes.RelatedInstanceNodes, // "RelatedInstanceNodes"
     relationshipPaths: [
      {
       relationship: {
        schemaName: "BisCore",
        className: "ModelContainsElements",
       },
       direction: RelationshipDirection.Forward, // "Forward"
       targetClass: {
        schemaName: "BisCore",
        className: "GeometricElement3d",
       },
      },
     ],
     groupByClass: false,
     groupByLabel: false,
    },
   ],
  },
  {
   ruleType: RuleTypes.ChildNodes, // "ChildNodes"
   condition: 'ParentNode.IsOfClass("GeometricElement3d", "BisCore")',
   specifications: [
    {
     specType: ChildNodeSpecificationTypes.RelatedInstanceNodes, // "RelatedInstanceNodes"
     relationshipPaths: [
      {
       relationship: {
        schemaName: "BisCore",
        className: "ElementOwnsChildElements",
       },
       direction: RelationshipDirection.Forward, // "Forward"
       targetClass: {
        schemaName: "BisCore",
        className: "GeometricElement3d",
       },
      },
     ],
     groupByClass: false,
     groupByLabel: false,
    },
   ],
  },
  {
   ruleType: RuleTypes.ImageIdOverride,
   condition: 'ThisNode.IsInstanceNode ANDALSO ThisNode.IsOfClass("Subject", "BisCore")',
   imageIdExpression: 'IIF(this.Parent.Id = NULL, "icon-imodel-hollow-2", "icon-folder")',
  },
  {
   ruleType: RuleTypes.ImageIdOverride,
   condition: 'ThisNode.IsInstanceNode ANDALSO ThisNode.IsOfClass("Model", "BisCore")',
   imageIdExpression: '"icon-folder"',
  },
  {
   ruleType: RuleTypes.ImageIdOverride,
   condition: 'ThisNode.IsInstanceNode ANDALSO ThisNode.IsOfClass("Category", "BisCore")',
   imageIdExpression: '"icon-layers"',
  },
  {
   ruleType: RuleTypes.ImageIdOverride,
   condition: 'ThisNode.IsInstanceNode ANDALSO ThisNode.IsOfClass("Element", "BisCore")',
   imageIdExpression: '"icon-item"',
  },
  {
   ruleType: RuleTypes.ImageIdOverride,
   condition: "ThisNode.IsClassGroupingNode",
   imageIdExpression: '"icon-ec-class"',
  },
 ],
};

export default ruleset;
