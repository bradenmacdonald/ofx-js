# OFX JS
Parse Open Financial Exchange (OFX) files into a usable data structure.

For details on the OFX file format, download the latest specification from
http://www.ofx.org/downloads.html

# Goals

* Work in the browser (no native code dependencies)
* Have as small a footprint as possible (minimize dependencies)
  - Currently, `xml2js` is the only dependency and it may be removed in the future.
* Parse only, no serialization
* Make no attempt to support pre-ES6 runtimes

# History

This is based on [node-ofx](https://github.com/chilts/node-ofx), modified to
be a pure-JavaScript implementation (so it works in the browser as well as in
node.js) and to offer a promise-based API. Due to different goals and a different
XML parser being used, it is not API-compatible and is probably slower.

# Usage

Example usage:

```javascript
import {parse as parseOFX} from 'ofx-js';

const ofxString = readFile("bank-statement.ofx");

parseOFX(ofxString).then(ofxData => {
    const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
    const accountId = statementResponse.BANKACCTFROM.ACCTID;
    const currencyCode = currencyCode = statementResponse.CURDEF;
    const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
    // do something...
});
```
