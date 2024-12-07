/**
 * @generated SignedSource<<2f67e70a7ff4490db4c9b3ded9fd28bf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type VennDiagramQuery$variables = {
  maxAverageDegree?: number | null | undefined;
  minConnections: number;
  roleIds?: ReadonlyArray<number | null | undefined> | null | undefined;
};
export type VennDiagramQuery$data = {
  readonly VennDiagram: {
    readonly data: ReadonlyArray<{
      readonly name: string;
      readonly sets: ReadonlyArray<string>;
    }>;
  } | null | undefined;
};
export type VennDiagramQuery = {
  response: VennDiagramQuery$data;
  variables: VennDiagramQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "maxAverageDegree"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "minConnections"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "roleIds"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "maxAverageDegree",
        "variableName": "maxAverageDegree"
      },
      {
        "kind": "Variable",
        "name": "minConnections",
        "variableName": "minConnections"
      },
      {
        "kind": "Variable",
        "name": "roleIds",
        "variableName": "roleIds"
      }
    ],
    "concreteType": "VennDiagram",
    "kind": "LinkedField",
    "name": "VennDiagram",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "VennDiagramSet",
        "kind": "LinkedField",
        "name": "data",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sets",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VennDiagramQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VennDiagramQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e8d9bd037570ed1ffa1c7f8bccc8d278",
    "id": null,
    "metadata": {},
    "name": "VennDiagramQuery",
    "operationKind": "query",
    "text": "query VennDiagramQuery(\n  $maxAverageDegree: Float\n  $minConnections: Int!\n  $roleIds: [Int]\n) {\n  VennDiagram(maxAverageDegree: $maxAverageDegree, minConnections: $minConnections, roleIds: $roleIds) {\n    data {\n      name\n      sets\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c867c0fb5d3577218f1b06c5ec3bbf1e";

export default node;
