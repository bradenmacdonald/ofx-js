import type { ParsedOFX } from './ofx-types.d.ts';
export type * as ofxTypes from './ofx-types.d.ts';

function sgml2Xml(sgml: string): string {
    return sgml
        .replace(/>\s+</g, '><')    // remove whitespace inbetween tag close/open
        .replace(/\s+</g, '<')      // remove whitespace before a close tag
        .replace(/>\s+/g, '>')      // remove whitespace after a close tag
        .replace(/<([A-Za-z0-9_]+)>([^<]+)<\/\1>/g, '<\$1>\$2') // remove closing tags if present. Example: <FOO>bar</FOO> becomes <FOO>bar for consistency, fixed in last step below.
        .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)/g, '<\$1\$2>\$3')
        .replace(/<(\w+?)>([^<]+)/g, '<\$1>\$2</\$1>'); // Add closing tag wherever they seem to be missing: <FOO>bar becomes <FOO>bar</FOO>
}

interface AstNode {
    name: string;
    attributes: Record<string, string>;
    children: AstNode[];
    content?: string;
}

/**
 * Parses an XML string into a basic Abstract Syntax Tree (AST).
 * Includes strict validation for matching opening and closing tags.
 */
function parseXmlString(xml: string): AstNode | undefined {
    xml = xml.trim();

    // strip comments
    xml = xml.replace(/<!--[\s\S]*?-->/g, "");

    function document(): AstNode | undefined {
        // Ignore declaration like <?xml ... ?>
        const m = match(/^<\?xml\s*/);
        if (m) {
            while (!(eos() || is("?>"))) {
                attribute();
            }
            match(/\?>\s*/);
        }

        return tag();
    }

    function tag(): AstNode | undefined {
        const m = match(/^<([\w-:.]+)\s*/);
        if (!m) return undefined;
        const node: AstNode = {
            name: m[1],
            attributes: {},
            children: [],
        };

        // attributes
        while (!(eos() || is(">") || is("?>") || is("/>"))) {
            const attr = attribute();
            if (!attr) return node;
            node.attributes[attr.name] = attr.value;
        }

        // self closing tag
        if (match(/^\s*\/>\s*/)) {
            return node;
        }

        match(/\??>\s*/);

        // content
        node.content = content();

        // children
        let child;
        while ((child = tag())) {
            node.children.push(child);
        }

        // closing
        const closeMatch = match(/^<\/([\w-:.]+)>\s*/);
        if (!closeMatch || closeMatch[1] !== node.name) {
            throw new Error("Missing closing tag for " + node.name);
        }

        return node;
    }

    function content(): string {
        const m = match(/^([^<]*)/);
        return m ? entities(m[1]) : "";
    }

    function attribute(): { name: string; value: string } | undefined {
        const m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m) return undefined;
        return { name: m[1], value: entities(strip(m[2])) };
    }

    function strip(val: string): string {
        return val.replace(/^['"]|['"]$/g, "");
    }

    function entities(val: string): string {
        return val.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    }

    function match(re: RegExp): RegExpMatchArray | undefined {
        const m = xml.match(re);
        if (!m) return undefined;
        xml = xml.slice(m[0].length);
        return m;
    }

    function eos(): boolean { return xml.length === 0; }
    function is(prefix: string): boolean { return xml.startsWith(prefix); }

    return document();
}

/**
 * Converts an XML AST node into a JSON-friendly Javascript object.
 * Replicates the behavior of xml2js with explicitArray: false.
 */
function convertAstToObject(astNode: AstNode | undefined): Record<string, any> | string | undefined {
    if (!astNode) return undefined;
    if (astNode.children.length === 0) return astNode.content ?? '';
    const obj: Record<string, any> = {};
    for (const child of astNode.children) {
        const childVal = convertAstToObject(child);
        if (childVal === undefined) continue;
        const existing = obj[child.name];
        if (existing !== undefined) {
            if (Array.isArray(existing)) {
                existing.push(childVal);
            } else {
                obj[child.name] = [existing, childVal];
            }
        } else {
            obj[child.name] = childVal;
        }
    }
    return obj;
}

/**
 * Given an XML string, parse it and return it as a JSON-friendly Javascript object
 */
function parseXml(xml: string): Record<string, any> {
    const ast = parseXmlString(xml);
    if (!ast) throw new Error("Failed to parse XML");
    return { [ast.name]: convertAstToObject(ast) ?? '' };
}

export interface LooselyTypedOFX {
    header: Record<string, string>;
    OFX: Record<string, any>;
}

/**
 * Given a string of OFX data, parse it.
 *
 * For better TypeScript typing, use `parseStrict` instead.
 */
export function parseSync(data: string): LooselyTypedOFX {
    // firstly, split into the header attributes and the footer sgml
    const ofx = data.split('<OFX>', 2);

    // parse the headers
    const header: Record<string, string> = {};
    for (const line of ofx[0].split(/\r?\n/)) {
        const parts = line.split(':', 2);
        if (parts.length === 2) header[parts[0]] = parts[1];
    }

    // make the SGML and the XML
    const content = '<OFX>' + ofx[1];

    // Parse the XML/SGML portion of the file into an object
    // Try as XML first, and if that fails do the SGML->XML mangling
    let result: Record<string, any>;
    try {
        result = parseXml(content);
    } catch {
        result = parseXml(sgml2Xml(content));
    }
    return { header, OFX: result['OFX'] };
}

/**
 * Given a string of OFX data, parse it asynchronously.
 * This function is only here for backward-compatibility purposes; it is not actually async.
 * @deprecated Use `parseStrict` or `parseSync` instead.
 */
export async function parse(data: string): Promise<LooselyTypedOFX> {
    return parseSync(data);
}

/**
 * Given a string of OFX data, parse it.
 *
 * This parser is not any more strict than the normal `parseOFX`,
 * but the TypeScript types of the returned data are much more strict.
 */
export function parseStrict(data: string): ParsedOFX {
    return parseSync(data) as ParsedOFX;
}
