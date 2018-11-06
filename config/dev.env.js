var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"https://openapi.au32.cn"'
  // API_ROOT:'"https://api.test.au32.cn"'
})