/**
 * @generated SignedSource<<f440fb5f35ba681c0fbfe0a00bd4c543>>
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
      readonly id: string;
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
            "name": "id",
            "storageKey": null
          },
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
    "cacheID": "25b5f29e7b092103777dbf65f3d6eb4e",
    "id": null,
    "metadata": {},
    "name": "VennDiagramQuery",
    "operationKind": "query",
    "text": "query VennDiagramQuery(\n  $maxAverageDegree: Float\n  $minConnections: Int!\n  $roleIds: [Int]\n) {\n  VennDiagram(maxAverageDegree: $maxAverageDegree, minConnections: $minConnections, roleIds: $roleIds) {\n    data {\n      id\n      name\n      sets\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3e65829f80738d7bca8a47275ae2805c";

export default node;
