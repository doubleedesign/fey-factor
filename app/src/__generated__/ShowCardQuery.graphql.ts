/**
 * @generated SignedSource<<a54ef640b0939a7df65dcbb34ab8a85f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ShowCardQuery$variables = {
  id: string;
};
export type ShowCardQuery$data = {
  readonly TvShow: {
    readonly __typename: "TvShow";
    readonly id: string;
    readonly people: ReadonlyArray<{
      readonly __typename: "Person";
      readonly degree: number | null | undefined;
      readonly id: string;
      readonly name: string;
      readonly roles: ReadonlyArray<{
        readonly __typename: "Role";
        readonly name: string | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined> | null | undefined;
    readonly title: string;
  } | null | undefined;
};
export type ShowCardQuery = {
  response: ShowCardQuery$data;
  variables: ShowCardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "degree",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowCardQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "TvShow",
        "kind": "LinkedField",
        "name": "TvShow",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Person",
            "kind": "LinkedField",
            "name": "people",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Role",
                "kind": "LinkedField",
                "name": "roles",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/)
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowCardQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "TvShow",
        "kind": "LinkedField",
        "name": "TvShow",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Person",
            "kind": "LinkedField",
            "name": "people",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Role",
                "kind": "LinkedField",
                "name": "roles",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "b23302ba663c84a5533abe66f43adf8f",
    "id": null,
    "metadata": {},
    "name": "ShowCardQuery",
    "operationKind": "query",
    "text": "query ShowCardQuery(\n  $id: ID!\n) {\n  TvShow(id: $id) {\n    __typename\n    id\n    title\n    people {\n      __typename\n      id\n      name\n      degree\n      roles {\n        __typename\n        name\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "60c63e6c8f36dd174529a40f6f2914e2";

export default node;
