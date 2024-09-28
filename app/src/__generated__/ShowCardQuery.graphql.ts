/**
 * @generated SignedSource<<bd88ed551a855336cd8de8f15d71af56>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ShowCardQuery$variables = {
  id: string;
};
export type ShowCardQuery$data = {
  readonly TvShow: {
    readonly end_year: number | null | undefined;
    readonly episode_count: number | null | undefined;
    readonly id: string;
    readonly people: ReadonlyArray<{
      readonly id: string;
    } | null | undefined> | null | undefined;
    readonly season_count: number | null | undefined;
    readonly start_year: number | null | undefined;
    readonly title: string | null | undefined;
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "TvShow",
    "kind": "LinkedField",
    "name": "TvShow",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
        "name": "start_year",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "end_year",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "season_count",
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
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "people",
        "plural": true,
        "selections": [
          (v1/*: any*/)
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
    "name": "ShowCardQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowCardQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7096313f1859a895893b71a6b109b501",
    "id": null,
    "metadata": {},
    "name": "ShowCardQuery",
    "operationKind": "query",
    "text": "query ShowCardQuery(\n  $id: ID!\n) {\n  TvShow(id: $id) {\n    id\n    title\n    start_year\n    end_year\n    season_count\n    episode_count\n    people {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "523849ae8630c1cd27770de5d72ee65c";

export default node;
