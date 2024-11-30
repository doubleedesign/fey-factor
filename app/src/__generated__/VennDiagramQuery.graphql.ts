/**
 * @generated SignedSource<<30cc6ced43bf51619ba05ae3e07316b9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type VennDiagramQuery$variables = {
  minPeople: number;
  minShows?: number | null | undefined;
};
export type VennDiagramQuery$data = {
  readonly VennDiagram: {
    readonly circles: ReadonlyArray<{
      readonly people: number;
      readonly show: string;
    }>;
    readonly intersections: ReadonlyArray<{
      readonly people: number;
      readonly shows: ReadonlyArray<string>;
    }>;
  } | null | undefined;
};
export type VennDiagramQuery = {
  response: VennDiagramQuery$data;
  variables: VennDiagramQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minPeople"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minShows"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "people",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "minPeople",
        "variableName": "minPeople"
      },
      {
        "kind": "Variable",
        "name": "minShows",
        "variableName": "minShows"
      }
    ],
    "concreteType": "VennDiagram",
    "kind": "LinkedField",
    "name": "VennDiagram",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "VennDiagramIntersection",
        "kind": "LinkedField",
        "name": "intersections",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "shows",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "VennDiagramCircle",
        "kind": "LinkedField",
        "name": "circles",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "show",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "VennDiagramQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "VennDiagramQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "cf6a1cf410c5c8634f317f95637a989a",
    "id": null,
    "metadata": {},
    "name": "VennDiagramQuery",
    "operationKind": "query",
    "text": "query VennDiagramQuery(\n  $minShows: Int\n  $minPeople: Int!\n) {\n  VennDiagram(minShows: $minShows, minPeople: $minPeople) {\n    intersections {\n      shows\n      people\n    }\n    circles {\n      show\n      people\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a1af2ca60d2da92dada82337c777798d";

export default node;
