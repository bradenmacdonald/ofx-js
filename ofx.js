const XmlParser = require('xml2js/lib/parser').Parser;

function sgml2Xml(sgml) {
    return sgml
        .replace(/>\s+</g, '><')    // remove whitespace inbetween tag close/open
        .replace(/\s+</g, '<')      // remove whitespace before a close tag
        .replace(/>\s+/g, '>')      // remove whitespace after a close tag
        .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)/g, '<\$1\$2>\$3' )
        .replace(/<(\w+?)>([^<]+)/g, '<\$1>\$2</\$1>');
}

/**
 * Given an XML string, parse it and return it as a JSON-friendly Javascript object
 * @param {string} xml The XML to parse
 * @returns {Promise} A promise that will resolve to the parsed XML as a JSON-style object
 */
function parseXml(xml) {
    const xmlParser = new XmlParser({explicitArray: false});
    return new Promise((resolve, reject) => {
        xmlParser.parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Given a string of OFX data, parse it.
 * @param {string} data The OFX data to parse
 * @returns {Promise} A promise that will resolve to the parsed data.
 */
function parse(data) {
    // firstly, split into the header attributes and the footer sgml
    const ofx = data.split('<OFX>', 2);

    // firstly, parse the headers
    const headerString = ofx[0].split(/\r?\n/);
    let header = {};
    headerString.forEach(attrs => {
        const headAttr = attrs.split(/:/,2);
        header[headAttr[0]] = headAttr[1];
    });

    // make the SGML and the XML
    const content = '<OFX>' + ofx[1];

    // Parse the XML/SGML portion of the file into an object
    // Try as XML first, and if that fails do the SGML->XML mangling
    return parseXml(content).catch(() => {
        // XML parse failed.
        // Do the SGML->XML Manging and try again.
        return parseXml(sgml2Xml(content));
    }).then(data => {
        // Put the headers into the returned data
        data.header = header;
        return data;
    });
}

module.exports.parse = parse;
