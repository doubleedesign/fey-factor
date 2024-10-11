/**
 * @generated SignedSource<<898de47f41807f49c56de7e9b0977366>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type VennDiagramQuery$variables = {
  limit: number;
};
export type VennDiagramQuery$data = {
  readonly TvShows: ReadonlyArray<{
    readonly id: string;
    readonly people: ReadonlyArray<{
      readonly name: string;
      readonly personId: string;
    } | null | undefined> | null | undefined;
    readonly title: string;
  } | null | undefined> | null | undefined;
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
    "name": "limit"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "limit",
    "variableName": "limit"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": "personId",
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VennDiagramQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "TvShow",
        "kind": "LinkedField",
        "name": "TvShows",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Person",
            "kind": "LinkedField",
            "name": "people",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VennDiagramQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "TvShow",
        "kind": "LinkedField",
        "name": "TvShows",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Person",
            "kind": "LinkedField",
            "name": "people",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a3bcb6962760767255be64fc4d462351",
    "id": null,
    "metadata": {},
    "name": "VennDiagramQuery",
    "operationKind": "query",
    "text": "query VennDiagramQuery(\n  $limit: Int!\n) {\n  TvShows(limit: $limit) {\n    id\n    title\n    people {\n      personId: id\n      name\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "aaa6dfaab641602ac450bffaa51bec33";

export default node;
