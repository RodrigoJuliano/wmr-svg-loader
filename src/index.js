import fs from 'fs';
import { DefaultHandler, Parser } from 'htmlparser';
import path from 'path';

function assembleNode(context, options, node, root) {
    if (node.type === 'text') {
        return JSON.stringify(node.data);
    }

    let useAttribs = Object.assign({}, node.attribs || {});
    let attribs = JSON.stringify(useAttribs);

    let children = '[]';
    if (node.children) {
        children =
            '[' +
            node.children
                .map((childNode) => assembleNode(context, options, childNode))
                .join(', ') +
            ']';
    }

    if (root) {
        return `h('${node.name}', Object.assign(${attribs}, rest), ${children})`;
    }

    return `h('${node.name}', ${attribs}, ${children})`;
}

function normalize(path) {
    if (path.indexOf('\\') == -1) return path;
    return path.replace(/\\/g, '/');
}

function svgLoaderPlugin({ importPrefix = 'svg:' } = {}) {
    const IMPORT_PREFIX = importPrefix;
    const INTERNAL_PREFIX = `\0${IMPORT_PREFIX}`;
    let options;
    return {
        name: 'wmr-svg-loader',
        enforce: 'normal',
        configResolved(config) {
            options = config;
        },
        async resolveId(id, importer) {
            if (id[0] === '\0' || id[0] === '\b') return;

            if (id.startsWith(IMPORT_PREFIX)) {
                id = id.slice(IMPORT_PREFIX.length);
            } else return;

            const resolved = await this.resolve(id, importer, {
                skipSelf: true,
            });
            if (!resolved) return;

            resolved.id = normalize(resolved.id);
            resolved.id = `${INTERNAL_PREFIX}${resolved.id}`;
            return resolved;
        },

        async load(id) {
            if (!id.startsWith(INTERNAL_PREFIX)) return;

            id = id.slice(INTERNAL_PREFIX.length);

            id = path.resolve(options.root || '.', id);

            this.addWatchFile(id);

            const source = fs.readFileSync(id, { encoding: 'utf8' });

            const handler = new DefaultHandler(function (error) {
                if (error) throw error;
            });
            const parser = new Parser(handler);
            parser.parseComplete(source);
            const svgNode = handler.dom.find(
                (node) => node.type === 'tag' && node.name === 'svg'
            );

            if (!svgNode) {
                throw new Error('Could not find svg element');
            }

            const svg = assembleNode(this, /*options */ null, svgNode, true);

            return `
                import { h } from 'preact';
                export default function (props) {
                    var styles = props.styles;
                    var rest = Object.assign({}, props);
                    delete rest.styles;
                    return ${svg};
                };
            `;
        },
    };
}

export default svgLoaderPlugin;
