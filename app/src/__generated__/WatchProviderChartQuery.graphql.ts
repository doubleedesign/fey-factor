/**
 * @generated SignedSource<<9a226040c81d046b042eda0a79fc4432>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type WatchProviderChartQuery$variables = {
  limit: number;
};
export type WatchProviderChartQuery$data = {
  readonly TvShows: ReadonlyArray<{
    readonly id: string;
    readonly providers: ReadonlyArray<{
      readonly logo_path: string | null | undefined;
      readonly provider_id: number;
      readonly provider_name: string;
      readonly provider_type: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly title: string;
  } | null | undefined> | null | undefined;
};
export type WatchProviderChartQuery = {
  response: WatchProviderChartQuery$data;
  variables: WatchProviderChartQuery$variables;
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
        "args": [
          {
            "kind": "Literal",
            "name": "filter",
            "value": {
              "provider_type": [
                "flatrate",
                "free"
              ]
            }
          }
        ],
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
        "storageKey": "providers(filter:{\"provider_type\":[\"flatrate\",\"free\"]})"
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
    "name": "WatchProviderChartQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WatchProviderChartQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f633fe585878cf195435bcf487d382bb",
    "id": null,
    "metadata": {},
    "name": "WatchProviderChartQuery",
    "operationKind": "query",
    "text": "query WatchProviderChartQuery(\n  $limit: Int!\n) {\n  TvShows(limit: $limit) {\n    id\n    title\n    providers(filter: {provider_type: [\"flatrate\", \"free\"]}) {\n      provider_id\n      provider_name\n      provider_type\n      logo_path\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7248f7cbcf1f59c9d953488aa03a7dab";

export default node;
