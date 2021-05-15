'use strict';

const path = require('path');
const stylus = require('stylus');

module.exports = function createPlugin(filename, options) {
  return {
    set: {
      filename: filename,
      ...(options.set || {}),
    },
    use: [...(options.use || [])],
    define: {
      $parseBlock(block) {
        let map = {};
        block.nodes.forEach(node => {
          let name = node.name,
            value = node.expr.nodes.map(node => node.toString()).join(' ');
          map[name] = value;
        });
        return map;
      },
      log(...args) {
        console.log('<styla log>:', ...args);
      },
      ...options.define,
    },
    include: [
      [
        ...(options.paths || []),
        path.resolve(path.dirname(filename), filename),
      ],
      ...(options.include || []),
    ],
    import: [
      path.resolve(__dirname, '../styles/index.styl'),
      ...(options.import || []),
    ],
  };
};
