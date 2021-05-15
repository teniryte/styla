'use strict';

const stylus = require('stylus');
const path = require('path');
const fs = require('fs');
const repeatString = require('ooi/repeat-string');
const stylusSupremacy = require('stylus-supremacy');
const util = require('./util');
const createPlugin = require('./create-plugin');

module.exports = {
  setupStylus(file, options = {}) {
    let source = this.formatSource(
        ['.styl', '.stylus'].includes(path.extname(file))
          ? fs.readFileSync(file, 'utf-8')
          : fs.readFileSync(file, 'utf-8')
      ),
      filename = file === source ? null : file,
      pack = stylus(source),
      plugin = createPlugin(filename, options);
    util
      .mapCall(plugin.set, pack.set, pack)
      .mapCall(plugin.define, pack.define, pack)
      .mapCall(plugin.set, pack.set, pack)
      .mapCall(plugin.include, pack.include, pack)
      .mapCall(plugin.use, pack.use, pack)
      .mapCall(plugin.import, pack.import, pack);
    return pack;
  },

  compileFile(file, options = {}) {
    var pack = this.setupStylus(fs.realpathSync(file, options));
    return pack;
  },

  render(source, options = {}) {
    var pack = this.compileFile(source, options);
    return pack.render();
  },

  renderFile(file, options = {}) {
    var pack = this.compileFile(file, options);
    return pack.render();
  },

  formatSource(source) {
    let code = stylusSupremacy.format(source, {
      insertColons: true,
      insertSemicolons: true,
      insertBraces: true,
      insertNewLineAroundBlocks: false,
    });
    let result = code.replace(
      /^(\s*)([^\;]+\;)\s*$\n^(\s*[^\;$]+)$/gim,
      (txt, indent, prop, next) => {
        return `${indent}${prop}\n${indent}$();\n${next}`;
      }
    );
    return result;

    function getBlock(start, indent) {
      let finish =
          source
            .slice(start + 1)
            .search(new RegExp(`^\\s{${indent.length + 2}}[^\s]`, 'mgi')) +
          start,
        code = source.slice(start, finish);
      return {
        start: start,
        indent: indent,
        finish: finish,
        code: code,
        result: `${code.slice(0, -1)}`,
      };
    }
  },
};

function isSelector(l = '') {
  let line = l.trim().toLowerCase(),
    starts = !![
      '.',
      '&',
      'a',
      'abbr',
      'address',
      'area',
      'article',
      'aside',
      'audio',
      'b',
      'bdi',
      'bdo',
      'blockquote',
      'body',
      'br',
      'button',
      'canvas',
      'caption',
      'cite',
      'code',
      'col',
      'colgroup',
      'command',
      'datalist',
      'dd',
      'del',
      'details',
      'dfn',
      'div',
      'dl',
      'dt',
      'em',
      'embed',
      'fieldset',
      'figcaption',
      'figure',
      'footer',
      'form',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'header',
      'hr',
      'html',
      'i',
      'iframe',
      'img',
      'input',
      'ins',
      'kbd',
      'keygen',
      'label',
      'legend',
      'li',
      'main',
      'map',
      'mark',
      'menu',
      'meter',
      'nav',
      'object',
      'ol',
      'optgroup',
      'option',
      'output',
      'p',
      'param',
      'pre',
      'progress',
      'q',
      'rp',
      'rt',
      'ruby',
      's',
      'samp',
      'section',
      'select',
      'small',
      'source',
      'span',
      'strong',
      'sub',
      'summary',
      'sup',
      'table',
      'tbody',
      'td',
      'textarea',
      'tfoot',
      'th',
      'thead',
      'time',
      'tr',
      'track',
      'u',
      'ul',
      'var',
      'video',
      'wbr',
    ].filter(starter => line.startsWith(starter)).length;
  return starts && line.endsWith('{');
}
