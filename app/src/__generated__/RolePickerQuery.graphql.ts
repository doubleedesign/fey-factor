/**
 * @generated SignedSource<<e6bd105708a69063e320cc7cace4a763>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RolePickerQuery$variables = Record<PropertyKey, never>;
export type RolePickerQuery$data = {
  readonly Roles: ReadonlyArray<{
    readonly id: string;
    readonly name: string | null | undefined;
  } | null | undefined> | null | undefined;
};
export type RolePickerQuery = {
  response: RolePickerQuery$data;
  variables: RolePickerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Role",
    "kind": "LinkedField",
    "name": "Roles",
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
        "name": "name",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RolePickerQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RolePickerQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "109ab102a1ee5aa51f57b7833e51cfa5",
    "id": null,
    "metadata": {},
    "name": "RolePickerQuery",
    "operationKind": "query",
    "text": "query RolePickerQuery {\n  Roles {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "f0935c3fa0a4c694cd36e065ef114d4b";

export default node;
