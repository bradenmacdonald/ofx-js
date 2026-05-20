import { readFileSync } from 'fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStrict as parse, type ofxTypes } from '../ofx.js';

/** Wrapper around assertDeepEqual that adds strict TypeScript type equivalence checking. */
function assertDeepEqual<X>(a: X, b: X) {
    assert.deepEqual(a, b);
}


test('parse example1', async () => {
    const file = readFileSync(new URL('data/example1.ofx', import.meta.url), 'utf8');
    const data = await parse(file);

    // Check header:
    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');
    assert.equal(data.header.DATA, 'OFXSGML');
    assert.equal(data.header.VERSION, '102');
    assert.equal(data.header.SECURITY, 'NONE');
    assert.equal(data.header.CHARSET, '1252');
    assert.equal(data.header.COMPRESSION, 'NONE');
    assert.equal(data.header.OLDFILEUID, 'NONE');
    assert.equal(data.header.NEWFILEUID, 'NONE');

    // Check for statement transaction response
    const statmentResponseMeta = data.OFX.BANKMSGSRSV1?.STMTTRNRS;
    if (!statmentResponseMeta || Array.isArray(statmentResponseMeta)) {
        throw Error("Expected single STMTTRNRS");
    }
    const statementResponse = statmentResponseMeta.STMTRS!;
    
    // Check account info:
    const currency = statementResponse.CURDEF;
    assert.equal(currency, 'NZD');
    const accountInfo: ofxTypes.BankAccount = statementResponse.BANKACCTFROM;
    assertDeepEqual(accountInfo, {
        ACCTID: '1234567-00',
        ACCTTYPE: 'SAVINGS',
        BANKID: '01',
        BRANCHID: '0123',
    });

    // Check transaction list dates:
    const startDate = statementResponse.BANKTRANLIST?.DTSTART;
    assert.equal(startDate, '20120101');
    const endDate = statementResponse.BANKTRANLIST?.DTEND;
    assert.equal(endDate, '20121003');

    // Check ledger balance:
    const ledgerBalance = statementResponse.LEDGERBAL;
    assertDeepEqual(ledgerBalance, {
        BALAMT: '4225.79',
        DTASOF: '20121004',
    });

    // Check transactions:
    const transactions = statementResponse.BANKTRANLIST?.STMTTRN;
    if (!Array.isArray(transactions)) {
        throw new Error('Expected multiple transactions.');
    }
    assert.equal(transactions.length, 5);
    assertDeepEqual(transactions[0], {
        DTPOSTED: '20120928',
        FITID: '20120928.0',
        MEMO: 'Credit Interest Paid',
        TRNAMT: '19.90', // Note: everything is a string, even amounts.
        TRNTYPE: 'INT',
    });
    assertDeepEqual(transactions[1], {
        DTPOSTED: '20120928',
        FITID: '20120928.1',
        MEMO: 'Withholding Tax',
        TRNAMT: '-1.01',
        TRNTYPE: 'DEBIT'
    });
    // ...
    assertDeepEqual(transactions[4], {
        DTPOSTED: '20120104',
        FITID: '20120104.6',
        MEMO: 'Debit Transfer Party',
        NAME: 'Transfer',
        TRNAMT: '-20.01',
        TRNTYPE: 'DEBIT'
    });

    const status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    assert.equal(status.CODE, '0');
    assert.equal(status.SEVERITY, 'INFO');
});

test('parse example2', async () => {
    const file = readFileSync(new URL('data/example2.ofx', import.meta.url), 'utf8');
    const data = await parse(file);

    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');

    // Check for statement transaction response
    const statmentResponseMeta = data.OFX.BANKMSGSRSV1?.STMTTRNRS;
    if (!statmentResponseMeta || Array.isArray(statmentResponseMeta)) {
        throw Error("Expected single STMTTRNRS");
    }
    const statementResponse = statmentResponseMeta.STMTRS!;

    const transactions = statementResponse.BANKTRANLIST?.STMTTRN;
    if (!Array.isArray(transactions)) {
        throw new Error('Expected multiple transactions.');
    }
    assert.equal(transactions.length, 29);
    assertDeepEqual(transactions[0], {
        CHECKNUM: '*****',
        DTPOSTED: '****',
        FITID: '******',
        MEMO: '*******',
        NAME: 'FRAIS DE TUTELLE',
        TRNAMT: '-45.54',
        TRNTYPE: 'DEBIT',
    });

    const status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    assert.equal(status.CODE, '0');
    assert.equal(status.SEVERITY, 'INFO');
});

test('parse XML', async () => {
    const file = readFileSync(new URL('data/example-xml.qfx', import.meta.url), 'utf8');
    const data = await parse(file);

    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');

    // Check for statement transaction response
    const statmentResponseMeta = data.OFX.BANKMSGSRSV1?.STMTTRNRS;
    if (!statmentResponseMeta || Array.isArray(statmentResponseMeta)) {
        throw Error("Expected single STMTTRNRS");
    }
    const statementResponse = statmentResponseMeta.STMTRS!;

    const transaction = statementResponse.BANKTRANLIST?.STMTTRN;
    assertDeepEqual(transaction, {
        TRNTYPE: 'INT',
        DTPOSTED: '20161215000550',
        TRNAMT: '0.84',
        FITID: '21172131531687',
        NAME: 'Interest Paid'
    });

    const status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    assert.equal(status.CODE, '0');
    assert.equal(status.SEVERITY, 'INFO');
});

test('parse credit-card.qfx', async () => {
    const file = readFileSync(new URL('data/credit-card.qfx', import.meta.url), 'utf8');
    const data = await parse(file);

    // Check header:
    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');
    assert.equal(data.header.DATA, 'OFXSGML');
    assert.equal(data.header.VERSION, '102');
    assert.equal(data.header.SECURITY, 'TYPE1');
    assert.equal(data.header.CHARSET, '1252');
    assert.equal(data.header.COMPRESSION, 'NONE');
    assert.equal(data.header.OLDFILEUID, 'NONE');
    assert.equal(data.header.NEWFILEUID, 'NONE');

    //Check sign on response
    const signOnResponse: ofxTypes.SignonResponse = data.OFX.SIGNONMSGSRSV1.SONRS;
    assert.equal(signOnResponse.DTSERVER, '20260520105121[-5]');
    assert.equal(signOnResponse.INTUBID, '00015'); // The "INTU.BID" field is not part of the OFX spec but is added in "Quicken" QFX files.
    assert.equal(signOnResponse.LANGUAGE, 'ENG');
    assertDeepEqual(signOnResponse.STATUS, { CODE: '0', MESSAGE: 'OK', SEVERITY: 'INFO' } satisfies ofxTypes.OFXStatus);

    // Check for credit card response message set
    const statmentResponseMeta = data.OFX.CREDITCARDMSGSRSV1?.CCSTMTTRNRS;
    if (!statmentResponseMeta || Array.isArray(statmentResponseMeta)) {
        throw Error("Expected single CCSTMTTRNRS");
    }
    const statementResponse = statmentResponseMeta.CCSTMTRS!;
    
    // Check account info:
    const currency = statementResponse.CURDEF;
    assert.equal(currency, 'CAD');
    const accountInfo = statementResponse.CCACCTFROM;
    assertDeepEqual(accountInfo, { ACCTID: '4510000000003333' });  // This would be the credit card number

    // Check transaction list dates:
    const startDate = statementResponse.BANKTRANLIST?.DTSTART;
    assert.equal(startDate, '20260323120000[-5]');
    const endDate = statementResponse.BANKTRANLIST?.DTEND;
    assert.equal(endDate, '20260513120000[-5]');

    // Check ledger balance:
    const ledgerBalance = statementResponse.LEDGERBAL;
    assertDeepEqual(ledgerBalance, {
        BALAMT: '904.53',
        DTASOF: '20260519',
    });

    // Check transactions:
    const transactions = statementResponse.BANKTRANLIST?.STMTTRN;
    if (!Array.isArray(transactions)) {
        throw new Error('Expected multiple transactions.');
    }
    assert.equal(transactions.length, 5);

    assertDeepEqual(transactions[0], {
        DTPOSTED: '20260323120000[-5]',
        FITID: '90000010020260323V001872E778F',
        MEMO: 'VANCOUVER BC',
        NAME: '7 DAYS COFFEE VANCOUVER',
        TRNAMT: '-6.88',
        TRNTYPE: 'DEBIT',
    });

    assertDeepEqual(transactions[1], {
        DTPOSTED: '20260323120000[-5]',
        FITID: '90000010020260323V001A5289515',
        MEMO: 'EMENT - MERCI', // Looks wrong but that's how it is in the file.
        NAME: 'PAYMENT - THANK YOU / PAI EMENT - MERCI',
        TRNAMT: '202.08',
        TRNTYPE: 'CREDIT'
    });

    assertDeepEqual(transactions[2], {
        DTPOSTED: '20260326120000[-5]',
        FITID: '90000010020260326V0017B184356',
        MEMO: 'VANCOUVER BC',
        NAME: 'PHARMACY #7182',
        TRNAMT: '-70.37',
        TRNTYPE: 'DEBIT',
    });

    assertDeepEqual(transactions[3], {
        DTPOSTED: '20260402120000[-5]',
        FITID: '90000010020260402V001207D2275',
        MEMO: 'VANCOUVER BC',
        NAME: 'T&T SUPERMARKET',
        TRNAMT: '-26.38',
        TRNTYPE: 'DEBIT',
    });

    assertDeepEqual(transactions[4], {
        DTPOSTED: '20260405120000[-5]',
        FITID: '90000010020260405V001B0C20CE5',
        MEMO: 'VANCOUVER BC',
        NAME: 'LYFT   *RIDE SAT 8PM VANCOUVER',
        TRNAMT: '-17.97',
        TRNTYPE: 'DEBIT',
    });

    const status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    assert.equal(status.CODE, '0');
    assert.equal(status.SEVERITY, 'INFO');
});
