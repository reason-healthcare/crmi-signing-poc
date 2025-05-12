# POC for FHIR Artifact Resource Signing

## Setup

```
npm install
```

Generate a new RS384 key

```
./bin/keygen
```

Start local OIDC provider

```
npm run dev
```

## Signing Example

Generate checksum of resource:

```
./bin/createHash ./resources/Library-FHIRCommon.json

892c98e8660c3b84f88cffc4759880ea6f73afa9f58a5ee5dd2f8b7c48250dca
```

Generate FHIR Signature for the resource:

```
./bin/signFHIR ./resources/Library-FHIRCommon.json

{
  "profile": [
    "http://hl7.org/fhir/uv/cql/StructureDefinition/cql-library",
    "http://hl7.org/fhir/uv/cql/StructureDefinition/elm-json-library"
  ],
  "extension": [
    {
      "url": "http://hl7.org/fhir/uv/crmi/fhir/StructureDefinition/artifact-signature",
      "valueSignature": {
        "resourceType": "Signature",
        "type": "ProofOfCreation",
        "sigFormat": "application/jwt",
        "when": "2025-05-12T10:17:55.135Z",
        "data": "eyJhbGciOiJSUzM4NCJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDozMDAwL29pZGMiLCJoYXNoIjoiODkyYzk4ZTg2NjBjM2I4NGY4OGNmZmM0NzU5ODgwZWE2ZjczYWZhOWY1OGE1ZWU1ZGQyZjhiN2M0ODI1MGRjYSJ9.T581_ZkQee7RnJpePnApDIgWtHCO6GUFltHF3riM0wEEAMuVK8X63OrBZpRMCFZWwJ9_RQk3Jo9q4Tyu5WxnZaFxyH0cDCs21gFuCtUanRf4jep2ZfShjVjmm90AGyAzz6EeTodpWyNL48Js__ZSmK8HahkFos5DWZdi93BZalOPvR-pAnzKgxyrrkdmLFZBjKC6drzqhfTyTY0P2yLZV0x6X3btvkdcci8_tqKDl8xz84Gut4iHr0fivP7CbzBoIO6Dlw1gScFWaE9ATRDvkTnSYu3JVptMZo4xgKhrL3ZQktrQZm1CIQ8tnMn5hCdT7W-DysejxxH9t128FYBA1Q"
      }
    }
  ]
}
```

This will output just the `meta` section of the resource, with an extension for the signature. You can decrypt the JWT with the included script (NOTE: you need to install `jq` for it to work):

```
./bin/jwt-decode eyJhbGciOiJ...

{
  "alg": "RS384"
}
{
  "iss": "https://localhost:3000/oidc",
  "hash": "892c98e8660c3b84f88cffc4759880ea6f73afa9f58a5ee5dd2f8b7c48250dca"
}
```

You can also validate the signature (e.g. using jwt.io) with the key found at http://localhost:3000/oidc/jwks

