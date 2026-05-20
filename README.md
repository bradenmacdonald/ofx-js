# OFX JS

Parse Open Financial Exchange (OFX) files into a usable data structure.

For details on the OFX file format, download the latest specification from
http://www.ofx.org/downloads.html

[![NPM Version](https://img.shields.io/npm/v/ofx-js)](https://www.npmjs.com/package/ofx-js)
![NPM Downloads](https://img.shields.io/npm/dm/ofx-js)

# Goals

* Work in the browser (no native code dependencies)
* Have as small a footprint as possible (minimize dependencies)
* Parse only, no serialization
* Make no attempt to support pre-ES6 runtimes

# History

This is based on [node-ofx](https://github.com/chilts/node-ofx), modified to
be a pure-JavaScript implementation (so it works in the browser as well as in
node.js) and to offer a promise-based API. Due to different goals and a different
XML parser being used, it is not API-compatible and is probably slower.

# Usage

Installation:

```sh
npm install ofx-js
```

Example usage:

```javascript
import {parseSync as parseOFX} from 'ofx-js';

const ofxString = readFile("bank-statement.ofx");

const ofxData = parseOFX(ofxString);

const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
const accountId = statementResponse.BANKACCTFROM.ACCTID;
const currencyCode = statementResponse.CURDEF;
const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
// do something...
```
