const { resolve } = require('path')

export default {
  input: 'src/core/index.js',
  output: {
    name: 'paul',
    file: resolve('dist/vue.test.js'),
    format: 'umd',
    env: 'development'
  }
};