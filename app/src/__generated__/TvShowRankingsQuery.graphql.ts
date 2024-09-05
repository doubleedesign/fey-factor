/**
 * @generated SignedSource<<69938e274d7c288aeab2f62b736b719d>>
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
    readonly id: string;
    readonly rankingData: {
      readonly average_degree: number | null | undefined;
      readonly total_connections: number | null | undefined;
      readonly weighted_score: number | null | undefined;
    } | null | undefined;
    readonly title: string | null | undefined;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "limit",
        "variableName": "limit"
      }
    ],
    "concreteType": "TvShow",
    "kind": "LinkedField",
    "name": "TvShows",
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
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "RankingData",
        "kind": "LinkedField",
        "name": "rankingData",
        "plural": false,
        "selections": [
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
    "name": "TvShowRankingsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TvShowRankingsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7ecf3ad5fbdfd0bf3e10aebf4e218c9b",
    "id": null,
    "metadata": {},
    "name": "TvShowRankingsQuery",
    "operationKind": "query",
    "text": "query TvShowRankingsQuery(\n  $limit: Int!\n) {\n  TvShows(limit: $limit) {\n    id\n    title\n    rankingData {\n      total_connections\n      average_degree\n      weighted_score\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7b7b3820aed77abf250aaf5dfcd44cd6";

export default node;
