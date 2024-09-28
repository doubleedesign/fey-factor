/**
 * @generated SignedSource<<95b99065127d24c2d66e4a3f2de5a6fc>>
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
    readonly providers: ReadonlyArray<{
      readonly logo_path: string | null | undefined;
      readonly provider_name: string;
      readonly provider_type: string | null | undefined;
    } | null | undefined> | null | undefined;
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
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Provider",
        "kind": "LinkedField",
        "name": "providers",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "provider_name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "provider_type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "logo_path",
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
    "cacheID": "6386d4db7b2e11a9e07a0300f9667921",
    "id": null,
    "metadata": {},
    "name": "TvShowRankingsQuery",
    "operationKind": "query",
    "text": "query TvShowRankingsQuery(\n  $limit: Int!\n) {\n  TvShows(limit: $limit) {\n    id\n    title\n    rankingData {\n      total_connections\n      average_degree\n      weighted_score\n    }\n    providers {\n      provider_name\n      provider_type\n      logo_path\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cc042ff8707814ef77def6a358e9b5f3";

export default node;
