/**
 * @generated SignedSource<<dc55c27f99792b5f4c8400850fe10a45>>
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
      readonly people_count: number;
      readonly title: string;
    }>;
    readonly intersections: ReadonlyArray<{
      readonly people_count: number;
      readonly titles: ReadonlyArray<string>;
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
  "name": "people_count",
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
            "name": "titles",
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
            "name": "title",
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
    "cacheID": "23320d9a706489029eed1fd029c372c4",
    "id": null,
    "metadata": {},
    "name": "VennDiagramQuery",
    "operationKind": "query",
    "text": "query VennDiagramQuery(\n  $minShows: Int\n  $minPeople: Int!\n) {\n  VennDiagram(minShows: $minShows, minPeople: $minPeople) {\n    intersections {\n      titles\n      people_count\n    }\n    circles {\n      title\n      people_count\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "88f208207c5a070c7ac97aaaa7919214";

export default node;
