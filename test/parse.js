const fs = require('fs');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const ofx = require('..');

test('parse example1', async () => {
    const file = fs.readFileSync(__dirname + '/data/example1.ofx', 'utf8');
    const data = await ofx.parse(file);

    assert.equal(data.header.OFXHEADER, '100');
    assert.equal(data.header.ENCODING, 'USASCII');

    const transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
    assert.equal(transactions.length, 5);

    const status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    assert.equal(status.CODE, '0');
    assert.equal(status.SEVERITY, 'INFO');
});

test('parse example2', async () => {
    const file = fs.readFileSync(__dirname + '/data/example2.ofx', 'utf8');
    const data = await ofx.parse(file);

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
    const file = fs.readFileSync(__dirname + '/data/example-xml.qfx', 'utf8');
    const data = await ofx.parse(file);

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
