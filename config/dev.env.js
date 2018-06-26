var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"https://openapi.au32.cn"'
  // API_ROOT:'"http://101.201.197.238:8099"'
  // API_ROOT:'"http://10.88.88.227:9191"'//马寅冬
  // API_ROOT:'"http://10.88.88.20:9191"'//削减
  API_ROOT:'"https://openapitest.au32.cn"'
})