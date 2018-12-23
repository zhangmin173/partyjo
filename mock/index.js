const fs = require('fs')
const path = require('path')

module.exports = function(api) {
  const json = require('.' + api + '.js')()
  return json
}