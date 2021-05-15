# styla

Stylus Utilities & Mixins Library

```js
const styla = require('styla');

// Render file
styla.renderFile('./styles.styl', {
  // Minify result code
  compress: true,
  // Set render properties
  set: {
    filename: './styles.styl',
  },
  // Define context globals
  define: {
    version: '0.0.1',
  },
  // Include files
  include: ['./lib/styles.styl'],
  // Import files
  imports: ['./lib/styles.styl'],
});

// Compile file, returns stylus build object
var build = styla.compileFile('./styles.styl', {
  // Same options as styla.renderFile(filename, options) above
});
```
