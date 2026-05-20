import { readFileSync } from 'fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStrict as parse } from '../ofx.js';

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
    const accountInfo = statementResponse.BANKACCTFROM;
    assert.deepEqual(accountInfo, {
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
    assert.deepEqual(ledgerBalance, {
        BALAMT: '4225.79',
        DTASOF: '20121004',
    });

    // Check transactions:
    const transactions = statementResponse.BANKTRANLIST?.STMTTRN;
    if (!Array.isArray(transactions)) {
        throw new Error('Expected multiple transactions.');
    }
    assert.equal(transactions.length, 5);
    assert.deepEqual(transactions[0], {
        DTPOSTED: '20120928',
        FITID: '20120928.0',
        MEMO: 'Credit Interest Paid',
        TRNAMT: '19.90', // Note: everything is a string, even amounts.
        TRNTYPE: 'INT',
    });
    assert.deepEqual(transactions[1], {
        DTPOSTED: '20120928',
        FITID: '20120928.1',
        MEMO: 'Withholding Tax',
        TRNAMT: '-1.01',
        TRNTYPE: 'DEBIT'
    });
    // ...
    assert.deepEqual(transactions[4], {
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
    assert.deepEqual(transactions[0], {
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
    assert.deepEqual(transaction, {
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
