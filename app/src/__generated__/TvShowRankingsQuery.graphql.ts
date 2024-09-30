/**
 * @generated SignedSource<<c4729a6106d164a58381b0df2c301f06>>
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
    readonly episode_count: number | null | undefined;
    readonly id: string;
    readonly providers: ReadonlyArray<{
      readonly logo_path: string | null | undefined;
      readonly provider_id: number;
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
        "kind": "ScalarField",
        "name": "episode_count",
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
            "name": "provider_id",
            "storageKey": null
          },
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
    "cacheID": "b9309f12004683e14bb3bb53d7502b6b",
    "id": null,
    "metadata": {},
    "name": "TvShowRankingsQuery",
    "operationKind": "query",
    "text": "query TvShowRankingsQuery(\n  $limit: Int!\n) {\n  TvShows(limit: $limit) {\n    id\n    title\n    episode_count\n    rankingData {\n      total_connections\n      average_degree\n      weighted_score\n    }\n    providers {\n      provider_id\n      provider_name\n      provider_type\n      logo_path\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7c35bb826519d0027ca8dbbc0040f4f4";

export default node;
