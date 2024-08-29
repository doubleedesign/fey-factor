/**
 * @generated SignedSource<<b8f25f7b304f88f83ba88ff1ae3cf2e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type App_RankedShowsQuery$variables = {
  limit: number;
};
export type App_RankedShowsQuery$data = {
  readonly TvShows: ReadonlyArray<{
    readonly average_degree?: number | null | undefined;
    readonly id?: string;
    readonly title?: string | null | undefined;
    readonly total_connections?: number | null | undefined;
    readonly weighted_score?: number;
  } | null | undefined> | null | undefined;
};
export type App_RankedShowsQuery = {
  response: App_RankedShowsQuery$data;
  variables: App_RankedShowsQuery$variables;
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
  "kind": "InlineFragment",
  "selections": [
    (v2/*: any*/),
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
      "kind": "ScalarField",
      "name": "total_connections",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "average_degree",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "weighted_score",
      "storageKey": null
    }
  ],
  "type": "TvShowWithRankingData",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "App_RankedShowsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "TvShows",
        "plural": true,
        "selections": [
          (v3/*: any*/)
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
    "name": "App_RankedShowsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "TvShows",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/)
            ],
            "type": "TvShow",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "da415cc43e96feb14790cdbbedeb8330",
    "id": null,
    "metadata": {},
    "name": "App_RankedShowsQuery",
    "operationKind": "query",
    "text": "query App_RankedShowsQuery(\n  $limit: Int!\n) {\n  TvShows(limit: $limit) {\n    __typename\n    ... on TvShowWithRankingData {\n      id\n      title\n      total_connections\n      average_degree\n      weighted_score\n    }\n    ... on TvShow {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "50465088771135ec6df8c0945a0b2e7a";

export default node;
