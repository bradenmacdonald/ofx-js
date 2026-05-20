# OFX JS

Parse Open Financial Exchange (OFX) files into a usable data structure.

✨ Now includes fairly comprehensive TypeScript types and documentation of the
various OLX data fields in the parsed data structure.

For details on the OFX file format, download the latest specification from
https://financialdataexchange.org/about-fdx/ofx-work-group/

[![NPM Version](https://img.shields.io/npm/v/ofx-js)](https://www.npmjs.com/package/ofx-js)
![NPM Downloads](https://img.shields.io/npm/dm/ofx-js)

# Goals

* Work in any JS environment (no dependencies at all)
* Have as small a footprint as possible
* Parse only, no serialization
* Full TypeScript types (opt-in using `parseStrict` instead of `parseSync`)

# History

This was originally based on [node-ofx](https://github.com/chilts/node-ofx), but has since been modified extensively.

# Usage

Installation:

```sh
npm install ofx-js
```

Example usage:

```typescript
import { parseStrict as parseOFX } from 'ofx-js';

const ofxString = readFile("bank-statement.ofx");

const ofxData = parseOFX(ofxString);

// Check that this file includes the expected response data:
if (!ofxData.OFX.BANKMSGSRSV1?.STMTTRNRS || Array.isArray(ofxData.OFX.BANKMSGSRSV1.STMTTRNRS)) {
    throw Error('Expected a single statement transaction response.');
}

const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
if (!statementResponse) {
    throw Error('Missing statement response payload.');
}

const accountId = statementResponse.BANKACCTFROM.ACCTID;
const currencyCode = statementResponse.CURDEF;
// Bank account transactions: may be an array of transactions, a single transaction, or undefined.
const transactionStatement = statementResponse.BANKTRANLIST?.STMTTRN;
// do something...
```
