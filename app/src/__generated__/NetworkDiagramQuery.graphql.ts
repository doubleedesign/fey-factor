/**
 * @generated SignedSource<<39ef0ed84fcdb8c58c03f61402e77cf9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type NetworkDiagramQuery$variables = {
  degreeZero: string;
};
export type NetworkDiagramQuery$data = {
  readonly Node: {
    readonly edges: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
      readonly nodes: ReadonlyArray<{
        readonly edges: ReadonlyArray<{
          readonly id: string;
          readonly name: string;
        } | null | undefined> | null | undefined;
        readonly id: string;
        readonly name: string;
      } | null | undefined> | null | undefined;
    } | null | undefined> | null | undefined;
    readonly id: string;
    readonly name: string;
  } | null | undefined;
};
export type NetworkDiagramQuery = {
  response: NetworkDiagramQuery$data;
  variables: NetworkDiagramQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "degreeZero"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": "name",
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "degreeZero"
      }
    ],
    "concreteType": "Node",
    "kind": "LinkedField",
    "name": "Node",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Edge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Node",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Edge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
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
    "name": "NetworkDiagramQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NetworkDiagramQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "17c4e8dc47598bc699e8c68e2cfcf84c",
    "id": null,
    "metadata": {},
    "name": "NetworkDiagramQuery",
    "operationKind": "query",
    "text": "query NetworkDiagramQuery(\n  $degreeZero: ID!\n) {\n  Node(id: $degreeZero) {\n    id\n    name\n    edges {\n      id\n      name: title\n      nodes {\n        id\n        name\n        edges {\n          id\n          name: title\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e041c32f8b7ffd61a5333c047bfdd2cd";

export default node;
