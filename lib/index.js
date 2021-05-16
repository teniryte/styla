'use strict';

const stylus = require('stylus');
const path = require('path');
const fs = require('fs');
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
    var pack = this.setupStylus(fs.realpathSync(file), options);
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
      /^(\s*)([^;]+;)\s*$\n^(\s*[^;$]+)$/gim,
      (txt, indent, prop, next) => {
        return `${indent}${prop}\n${indent}$();\n${next}`;
      }
    );
    return result;
  },
};
