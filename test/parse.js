import { readFileSync } from 'fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../ofx.js';

test('parse example1', async () => {
    const file = readFileSync(new URL('data/example1.ofx', import.meta.url), 'utf8');
    const data = await parse(file);

    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');

    const transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
    assert.equal(transactions.length, 5);

    const status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    assert.equal(status.CODE, '0');
    assert.equal(status.SEVERITY, 'INFO');
});

test('parse example2', async () => {
    const file = readFileSync(new URL('data/example2.ofx', import.meta.url), 'utf8');
    const data = await parse(file);

    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');

    const transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
    assert.equal(transactions.length, 29);
    assert.equal(transactions[0].TRNAMT, "-45.54");

    const status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    assert.equal(status.CODE, '0');
    assert.equal(status.SEVERITY, 'INFO');
});

test('parse XML', async () => {
    const file = readFileSync(new URL('data/example-xml.qfx', import.meta.url), 'utf8');
    const data = await parse(file);

    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');

    const transaction = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
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
