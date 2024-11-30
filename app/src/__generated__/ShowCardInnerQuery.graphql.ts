/**
 * @generated SignedSource<<9ab4a02bceba83587b022e1aecd336ac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ShowCardInnerQuery$variables = {
  id: string;
};
export type ShowCardInnerQuery$data = {
  readonly TvShow: {
    readonly end_year: number | null | undefined;
    readonly episode_count: number | null | undefined;
    readonly overview: string | null | undefined;
    readonly poster_path: string | null | undefined;
    readonly season_count: number | null | undefined;
    readonly start_year: number | null | undefined;
    readonly title: string;
  } | null | undefined;
};
export type ShowCardInnerQuery = {
  response: ShowCardInnerQuery$data;
  variables: ShowCardInnerQuery$variables;
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
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "start_year",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "end_year",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "season_count",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "episode_count",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "overview",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "poster_path",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowCardInnerQuery",
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
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
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
    "name": "ShowCardInnerQuery",
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
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "26f13d074e799f41fec1a70a3341aaa6",
    "id": null,
    "metadata": {},
    "name": "ShowCardInnerQuery",
    "operationKind": "query",
    "text": "query ShowCardInnerQuery(\n  $id: ID!\n) {\n  TvShow(id: $id) {\n    title\n    start_year\n    end_year\n    season_count\n    episode_count\n    overview\n    poster_path\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "08a2417ffc59374acc4221c16bcf5223";

export default node;
