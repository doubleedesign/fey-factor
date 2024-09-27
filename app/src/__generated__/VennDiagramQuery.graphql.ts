/**
 * @generated SignedSource<<749d9ca67d09c1170811436b955e2d94>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type VennDiagramQuery$variables = Record<PropertyKey, never>;
export type VennDiagramQuery$data = {
  readonly TvShows: ReadonlyArray<{
    readonly id: string;
    readonly people: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    } | null | undefined> | null | undefined;
    readonly title: string | null | undefined;
  } | null | undefined> | null | undefined;
};
export type VennDiagramQuery = {
  response: VennDiagramQuery$data;
  variables: VennDiagramQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "TvShow",
    "kind": "LinkedField",
    "name": "TvShows",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "people",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "VennDiagramQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "VennDiagramQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "83c998a566237b28e02dba852348fdf3",
    "id": null,
    "metadata": {},
    "name": "VennDiagramQuery",
    "operationKind": "query",
    "text": "query VennDiagramQuery {\n  TvShows {\n    id\n    title\n    people {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0e8cc007afd5ed2c318473dc279ef87c";

export default node;
