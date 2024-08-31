/**
 * @generated SignedSource<<61ea9f89a4084ed2826dbe638cd4ec91>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TvShowRankingsQuery$variables = {
  limit: number;
};
export type TvShowRankingsQuery$data = {
  readonly TvShows: ReadonlyArray<{
    readonly average_degree?: number | null | undefined;
    readonly id?: string;
    readonly title?: string;
    readonly total_connections?: number | null | undefined;
    readonly weighted_score?: number;
  } | null | undefined> | null | undefined;
};
export type TvShowRankingsQuery = {
  response: TvShowRankingsQuery$data;
  variables: TvShowRankingsQuery$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "total_connections",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "average_degree",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "weighted_score",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TvShowRankingsQuery",
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
            "kind": "InlineFragment",
            "selections": [
              {
                "kind": "RequiredField",
                "field": (v2/*: any*/),
                "action": "LOG",
                "path": "TvShows.id"
              },
              {
                "kind": "RequiredField",
                "field": (v3/*: any*/),
                "action": "LOG",
                "path": "TvShows.title"
              },
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "type": "TvShowWithRankingData",
            "abstractKey": null
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
    "name": "TvShowRankingsQuery",
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "type": "TvShowWithRankingData",
            "abstractKey": null
          },
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
    "cacheID": "db74a3eedfabe0f2e95f935f4a5e9dbf",
    "id": null,
    "metadata": {},
    "name": "TvShowRankingsQuery",
    "operationKind": "query",
    "text": "query TvShowRankingsQuery(\n  $limit: Int!\n) {\n  TvShows(limit: $limit) {\n    __typename\n    ... on TvShowWithRankingData {\n      id\n      title\n      total_connections\n      average_degree\n      weighted_score\n    }\n    ... on TvShow {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2422ac696ecb6f0dbd1730bf3711d2b3";

export default node;
