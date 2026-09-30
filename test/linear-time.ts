import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSync } from '../ofx.js';

const MB = 1024 * 1024;
const HEADER = 'OFXHEADER:100\nDATA:OFXSGML\nVERSION:102\n\n';

/** Returns '<OFX>' followed by `unit` repeated to fill about `size` characters, then `end`. */
function repeated(unit: string, size: number, end = ''): string {
    return HEADER + '<OFX>' + unit.repeat(Math.floor(size / unit.length)) + end;
}

/** Parses `data` and returns the time it took, in milliseconds. These inputs are malformed, so an error is expected. */
function timeParse(data: string): number {
    const start = performance.now();
    try {
        parseSync(data);
    } catch {
        // Rejecting the input is fine; taking a long time to do so is not.
    }
    return performance.now() - start;
}

// Each of these inputs used to take minutes or more to parse, because a regular
// expression backtracked quadratically or exponentially. Linear-time parsing
// finishes each one in tens of milliseconds, so one second leaves a wide margin
// for slow machines.
const cases: [string, string][] = [
    ['a long run of whitespace', repeated(' ', MB)],
    ['many unclosed comments', repeated('<!--', MB)],
    ['many unfinished tags', repeated('<A', MB, '</OFX>')],
    ['a long attribute name', repeated('B', MB, '</OFX>').replace('<OFX>', '<OFX><A ')],
    ['a long unterminated tag name', repeated('A', MB).replace('<OFX>', '<OFX><')],
    ['a 40-character tag name', HEADER + '<OFX><' + 'A'.repeat(40) + '>x'],
];

for (const [name, data] of cases) {
    test(`parse a file with ${name} in linear time`, () => {
        const ms = timeParse(data);
        assert.ok(ms < 1000, `took ${Math.round(ms)} ms`);
    });
}

test('ignore XML comments', () => {
    const data = parseSync('<OFX><!-- a comment --><A>x</A><!-- another\ncomment --><B>y</B></OFX>');
    assert.deepEqual(data.OFX, { A: 'x', B: 'y' });
});

test('keep an unclosed XML comment', () => {
    assert.throws(() => parseSync('<OFX><!-- a comment --><A>x</A><!-- unclosed <B>y</B></OFX>'), /Missing closing tag for OFX/);
});

test('ignore XML attributes', () => {
    const data = parseSync('<OFX><A k="v" j=\'w\'>x</A><B n=1 >y</B></OFX>');
    assert.deepEqual(data.OFX, { A: 'x', B: 'y' });
});
