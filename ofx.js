
function sgml2Xml(sgml) {
    return sgml
        .replace(/>\s+</g, '><')    // remove whitespace inbetween tag close/open
        .replace(/\s+</g, '<')      // remove whitespace before a close tag
        .replace(/>\s+/g, '>')      // remove whitespace after a close tag
        .replace(/<([A-Za-z0-9_]+)>([^<]+)<\/\1>/g, '<\$1>\$2') // remove closing tags if present. Example: <FOO>bar</FOO> becomes <FOO>bar for consistency, fixed in last step below.
        .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)/g, '<\$1\$2>\$3')
        .replace(/<(\w+?)>([^<]+)/g, '<\$1>\$2</\$1>'); // Add closing tag wherever they seem to be missing: <FOO>bar becomes <FOO>bar</FOO>
}

/**
 * Parses an XML string into a basic Abstract Syntax Tree (AST).
 * Includes strict validation for matching opening and closing tags.
 * 
 * @param {string} xml - The XML string to parse.
 * @returns {Object|undefined} The root node of the AST.
 */
function parseXmlString(xml) {
    xml = xml.trim();

    // strip comments
    xml = xml.replace(/<!--[\s\S]*?-->/g, "");

    function document() {
        // Ignore declaration like <?xml ... ?>
        let m = match(/^<\?xml\s*/);
        if (m) {
            while (!(eos() || is("?>"))) {
                attribute();
            }
            match(/\?>\s*/);
        }

        return tag();
    }

    function tag() {
        const m = match(/^<([\w-:.]+)\s*/);
        if (!m) return;

        const node = {
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

    function content() {
        const m = match(/^([^<]*)/);
        if (m) return entities(m[1]);
        return "";
    }

    function attribute() {
        const m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m) return;
        return { name: m[1], value: entities(strip(m[2])) };
    }

    function strip(val) {
        return val.replace(/^['"]|['"]$/g, "");
    }

    function entities(val) {
        return val.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    }

    function match(re) {
        const m = xml.match(re);
        if (!m) return;
        xml = xml.slice(m[0].length);
        return m;
    }

    function eos() {
        return xml.length === 0;
    }

    function is(prefix) {
        return xml.startsWith(prefix);
    }

    return document();
}

/**
 * Converts an XML AST node into a JSON-friendly Javascript object.
 * Replicates the behavior of xml2js with explicitArray: false.
 * 
 * @param {Object} astNode - The AST node to convert.
 * @returns {Object|string|undefined} The mapped JSON representation.
 */
function convertAstToObject(astNode) {
    if (!astNode) return undefined;

    if (astNode.children.length === 0) {
        return astNode.content || '';
    }

    const obj = {};
    for (const child of astNode.children) {
        const childVal = convertAstToObject(child);
        if (obj[child.name] !== undefined) {
            if (!Array.isArray(obj[child.name])) {
                obj[child.name] = [obj[child.name]];
            }
            obj[child.name].push(childVal);
        } else {
            obj[child.name] = childVal;
        }
    }
    return obj;
}

/**
 * Given an XML string, parse it and return it as a JSON-friendly Javascript object
 * @param {string} xml The XML to parse
 * @returns {Promise} A promise that will resolve to the parsed XML as a JSON-style object
 */
function parseXml(xml) {
    const ast = parseXmlString(xml);
    if (!ast) {
        throw new Error("Failed to parse XML");
    }
    const result = {};
    result[ast.name] = convertAstToObject(ast);
    return result;
}

/**
 * Given a string of OFX data, parse it.
 * @param {string} data The OFX data to parse
 * @returns {Promise} A promise that will resolve to the parsed data.
 */
function parseSync(data) {
    // firstly, split into the header attributes and the footer sgml
    const ofx = data.split('<OFX>', 2);

    // firstly, parse the headers
    const headerString = ofx[0].split(/\r?\n/);
    let header = {};
    headerString.forEach(attrs => {
        const headAttr = attrs.split(/:/, 2);
        header[headAttr[0]] = headAttr[1];
    });

    // make the SGML and the XML
    const content = '<OFX>' + ofx[1];

    // Parse the XML/SGML portion of the file into an object
    // Try as XML first, and if that fails do the SGML->XML mangling
    let result;
    try {
        result = parseXml(content);
    } catch (err) {
        result = parseXml(sgml2Xml(content));
    }
    result.header = header;
    return result;
}

/**
 * Given a string of OFX data, parse it asynchronously.
 * This function is only here for backward-compatibility purposes.
 * @param {string} data The OFX data to parse
 * @returns {Promise} A promise that will resolve to the parsed data.
 */
async function parse(data) {
    return parseSync(data);
}

export { parse, parseSync };
