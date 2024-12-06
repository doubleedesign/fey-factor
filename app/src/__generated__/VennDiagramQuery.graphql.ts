/**
 * @generated SignedSource<<7078e033b154ee5b28b65b0e9478e122>>
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
    "cacheID": "9c4cc8a58461832f6023f57b3203b684",
    "id": null,
    "metadata": {},
    "name": "VennDiagramQuery",
    "operationKind": "query",
    "text": "query VennDiagramQuery(\n  $maxAverageDegree: Float\n  $minConnections: Int!\n) {\n  VennDiagram(maxAverageDegree: $maxAverageDegree, minConnections: $minConnections) {\n    data {\n      name\n      sets\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "88cc0949e8be9d11d56b4f2e206057ee";

export default node;
